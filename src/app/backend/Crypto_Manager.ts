import * as crypto from "crypto"; // It has NOT to be like this: import crypto from "crypto";
import { Database_Settings } from "./Database_Settings";

/**
 ** Encryption and Decryption - The Final Solution.
 * Guide: https://dev.to/vapourisation/east-encryption-in-typescript-3948
 * Cypher MUSS im main-Prozess benutzt, und kann NICHT im render Process genutzt werden.
 * 
 * - Uses a fix KEY
 * - IV is combined and stored with the encrypted text.
 *
 * @author Carsten Nichte
 *
 */
export class Crypto_Manager {
  private static IV_LENGTH:number = 32; // Bytes
  private static ALGORITHM:string = "aes-256-cbc"; // CBC stands for "Cipher Block Chaining" which encrypts the data.
  private static ENCODING: BufferEncoding = "hex";
  // the key should be randaom 32 BYTES. Dont change this, otherwise decryption fails.
  private static KEY: Buffer = Buffer.from([
    10, 92, 101, 83, 204, 247, 102, 37, 106, 147, 250, 136, 186, 70, 222, 83,
    39, 241, 26, 66, 211, 82, 171, 251, 61, 86, 141, 129, 249, 198, 29, 100,
  ]);

  public static encrypt(plain_text: string): string {
    try {
      // Initialisation Vector.
      // is used as the first source for a XOR method in the Chain
      // should always be random, preferably cryptographically secure but doesn't need to be secret.
      const iv = crypto.randomBytes(16);

      // encrypt cipher, specifys the algorithm, the key and the IV.
      const cipher = crypto.createCipheriv(
        Crypto_Manager.ALGORITHM,
        Crypto_Manager.KEY,
        iv
      );

      // update() - encrypt the text
      // final() - close the cipher and ensure no other changes can be made
      // any further attempts to interact with the cipher result in an error being thrown.
      const encrypted = Buffer.concat([
        cipher.update(plain_text, "utf-8"),
        cipher.final(),
      ]);

      // combine the IV and the encrypted string
      // converting them both to a specified encoding,
      // I've used hex encoding but that's really not really important
      // as long as the same encoding is used when decrypting.
      return (
        iv.toString(Crypto_Manager.ENCODING) +
        encrypted.toString(Crypto_Manager.ENCODING)
      );
    } catch (e) {
      console.error(e);
    }
  }

  public static decrypt(encrypted_text: string): string {
    let result = null;

    //  split up the IV and the encrypted string
    let iv_string: string = encrypted_text.slice(0, Crypto_Manager.IV_LENGTH);
    let encrypted_string: string = encrypted_text.slice(
      Crypto_Manager.IV_LENGTH
    );

    try {
      const iv = Buffer.from(iv_string, Crypto_Manager.ENCODING);
      const encryptedText = Buffer.from(
        encrypted_string,
        Crypto_Manager.ENCODING
      );

      const decipher = crypto.createDecipheriv(
        Crypto_Manager.ALGORITHM,
        Crypto_Manager.KEY,
        iv
      );

      const decrypted = decipher.update(encryptedText);
      result = Buffer.concat([decrypted, decipher.final()]).toString();
    } catch (e) {
      console.error(e);
    }

    return result;
  }
}

export interface Crypto_Props {
  iv: any;
  key: any;
  tag: any;
}

/**
 *! Encryption and Decryption - Exploration 2.
 * Guide: https://medium.com/@tony.infisical/guide-to-nodes-crypto-module-for-encryption-decryption-65c077176980
 *
 * Here we have individual Props for every Encryption an Decryption.
 * Props are stored in the settings (which is insecure)
 * Is not tested if it works.
 */
export class Crypto_Manager_2 {
  public static encrypt = (
    plain_text: string,
    settings: Database_Settings
  ): string => {
    // create a random initialization vector
    const iv = crypto.randomBytes(12).toString("base64");
    const key = crypto.randomBytes(32).toString("base64");

    // create a cipher object
    const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

    // update the cipher object with the plaintext to encrypt
    let ciphertext = cipher.update(plain_text, "utf8", "base64");

    // finalize the encryption process
    ciphertext += cipher.final("base64");

    // retrieve the authentication tag for the encryption
    const tag = cipher.getAuthTag();

    let props: Crypto_Props = {
      iv: iv,
      key: key,
      tag: tag,
    };

    //! STORE PROPS
    settings.conf.set("currentuser_props", props);

    return ciphertext;
  };

  public static decrypt = (
    cipher_text: string,
    settings: Database_Settings
  ): string => {
    //! LOAD PROPS
    let props: Crypto_Props = settings.conf.get(
      "currentuser_props"
    ) as Crypto_Props;

    // create a decipher object
    const decipher = crypto.createDecipheriv(
      "aes-256-gcm",
      Buffer.from(props.key, "base64"),
      Buffer.from(props.iv, "base64")
    );

    // set the authentication tag for the decipher object
    decipher.setAuthTag(Buffer.from(props.tag, "base64"));

    // update the decipher object with the base64-encoded ciphertext
    let plaintext = decipher.update(cipher_text, "base64", "utf8");

    // finalize the decryption process
    plaintext += decipher.final("utf8");

    return plaintext;
  };
}

/**
 *! Encryption and Decryption - Exploration 3.
 *
 * Guide: https://gist.github.com/ChaoLiangSuper/0e13f77712b68682f0d8ebabb2d63aa8
 *
 * Here i got an error that the key length doesnt fit.
 * thats because process.env.ENCRYPTION_KEY!; is not defiend.
 * I have fixed this in Crypto_Manager with a const Buffer.from([])
 * additionaly here are some deprecation warnings.
 */
export class Crypto_Manager_3 {
  private static ALGORITHM = "aes-256-cbc";
  private static ENCODING: BufferEncoding = "hex";
  private static IV_LENGTH = 16;
  private static KEY = process.env.ENCRYPTION_KEY!;

  public static encrypt = (data: string) => {
    const iv = crypto.randomBytes(Crypto_Manager_3.IV_LENGTH);
    const cipher = crypto.createCipheriv(
      Crypto_Manager_3.ALGORITHM,
      Buffer.from(Crypto_Manager_3.KEY),
      iv
    );
    return Buffer.concat([cipher.update(data), cipher.final(), iv]).toString(
      Crypto_Manager_3.ENCODING
    );
  };

  public static decrypt = (data: string) => {
    const binaryData = Buffer.from(data, Crypto_Manager_3.ENCODING);
    const iv = binaryData.slice(-Crypto_Manager_3.IV_LENGTH);
    const encryptedData = binaryData.slice(
      0,
      binaryData.length - Crypto_Manager_3.IV_LENGTH
    );
    const decipher = crypto.createDecipheriv(
      Crypto_Manager_3.ALGORITHM,
      new Buffer(Crypto_Manager_3.KEY),
      iv
    );

    return Buffer.concat([
      decipher.update(encryptedData),
      decipher.final(),
    ]).toString();
  };
}
