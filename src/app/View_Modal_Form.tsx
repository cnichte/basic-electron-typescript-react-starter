/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { Card, Modal, Input, Form } from "antd";
import type { GetRef } from "antd";

const { Meta } = Card;
const { TextArea } = Input;
type FormInstance = GetRef<typeof Form>;

interface ModalFormProps {
  id: string;
  data: any;
  open: boolean;
  onCancel: () => void;
}

// reset form fields when modal is form, closed
const useResetFormOnCloseModal = ({
  form,
  open,
}: {
  form: FormInstance;
  open: boolean;
}) => {
  const prevOpenRef = useRef<boolean>();
  useEffect(() => {
    prevOpenRef.current = open;
  }, [open]);
  const prevOpen = prevOpenRef.current;

  useEffect(() => {
    if (!open && prevOpen) {
      form.resetFields();
    }
  }, [form, prevOpen, open]);
};

/* ==========================================================

    * Modales Formular

   ========================================================== */

export const View_Modal_Form: React.FC<ModalFormProps> = ({
  id,
  data,
  open,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [modalOpen, setModalOpen] = useState(open);

  const showModal = () => {
    setModalOpen(true);
  };

  const hideModal = () => {
    setModalOpen(false);
  };

  form.setFieldsValue(data);

  useResetFormOnCloseModal({
    form,
    open,
  });

  const onOk = () => {
    console.log("Modal-Form Ok");
    form.submit();
  };

  return (
    <>
      <Form.Provider
        onFormFinish={(name, { values, forms }) => {
          console.log("Modal-Form finished...", name);
          // if (name === value.id) {
          // value.title = values.title;
          // value.description = values.description;
          // value.is_cover = values.is_cover;
          hideModal();
          // }
        }}
      >
        <Modal
          title="Metadaten bearbeiten"
          open={modalOpen}
          onOk={onOk}
          onCancel={onCancel}
        >
          <Form form={form} layout="vertical" name={id}>
            <Form.Item name="title" label="Titel">
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </Form.Provider>
    </>
  );
};
