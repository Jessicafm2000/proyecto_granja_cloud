//export default function Vaccines(){ return <h2>Vacunación</h2>; }
import { Card, Row, Col, Input, Button, Modal, Form, Select, DatePicker } from "antd";
import { SearchOutlined, PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useState } from "react";
import dayjs from "dayjs";

export default function Vaccination() {
  const animals = [
    { id: 1, name: "Ana", img: "./animals/vaca.png" },
    { id: 2, name: "Beatriz", img: "./animals/vaca.png" },
    { id: 3, name: "Carla", img: "./animals/gallina.png" },
    { id: 4, name: "Diana", img: "./animals/gallina.png" },
  ];

  const initialRecords = [
    { id: 1, animalId: 1, vaccine: "Fiebre Aftosa", date: "2025-08-01", nextDate: "2026-08-01", status: "Aplicada" },
    { id: 2, animalId: 2, vaccine: "Brucelosis", date: "2025-07-20", nextDate: "2026-07-20", status: "Aplicada" },
    { id: 3, animalId: 3, vaccine: "Fiebre Aftosa", date: "2025-08-10", nextDate: "2026-08-10", status: "Pendiente" },
  ];

  const [records, setRecords] = useState(initialRecords);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAnimal, setFilterAnimal] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();

  const filteredRecords = records.filter(record =>
    record.vaccine.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterAnimal ? record.animalId === filterAnimal : true) &&
    (filterStatus ? record.status === filterStatus : true)
  );

  const showModal = (record = null) => {
    if (record) {
      setEditingRecord(record);
      form.setFieldsValue({
        animalId: record.animalId,
        vaccine: record.vaccine,
        date: dayjs(record.date),
        nextDate: record.nextDate ? dayjs(record.nextDate) : null,
        status: record.status,
      });
    } else {
      setEditingRecord(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
    form.resetFields();
  };

  const handleAddOrEditRecord = (values) => {
    const newRecord = {
      id: editingRecord ? editingRecord.id : records.length + 1,
      animalId: values.animalId,
      vaccine: values.vaccine,
      date: values.date.format("YYYY-MM-DD"),
      nextDate: values.nextDate ? values.nextDate.format("YYYY-MM-DD") : null,
      status: values.status,
    };

    if (editingRecord) {
      setRecords(records.map(r => r.id === editingRecord.id ? newRecord : r));
    } else {
      setRecords([newRecord, ...records]);
    }
    handleCancel();
  };

  const handleDeleteRecord = (id) => {
    setRecords(records.filter(r => r.id !== id));
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <Input
          placeholder="Buscar vacuna"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "250px" }}
          prefix={<SearchOutlined />}
        />
        <Select
          placeholder="Filtrar por animal"
          style={{ width: "180px" }}
          allowClear
          onChange={value => setFilterAnimal(value)}
        >
          {animals.map(a => (
            <Select.Option key={a.id} value={a.id}>{a.name}</Select.Option>
          ))}
        </Select>
        <Select
          placeholder="Filtrar por estado"
          style={{ width: "180px" }}
          allowClear
          onChange={value => setFilterStatus(value)}
        >
          <Select.Option value="Aplicada">Aplicada</Select.Option>
          <Select.Option value="Pendiente">Pendiente</Select.Option>
        </Select>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
          Agregar Vacuna
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        {filteredRecords.map(record => {
          const animal = animals.find(a => a.id === record.animalId) || { name: "Desconocido", img: "./animals/default.png" };
          return (
            <Col key={record.id} xs={24} sm={12} md={8} lg={6}>
              <Card hoverable style={{ position: "relative" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <img
                    src={animal.img || "./animals/default.png"}
                    alt={animal.name}
                    style={{ width: "50px", height: "50px", objectFit: "contain" }}
                  />
                  <div>
                    <h3>{record.vaccine}</h3>
                    <p>Animal: {animal.name}</p>
                    <p>Fecha: {record.date}</p>
                    <p>Próxima dosis: {record.nextDate || "-"}</p>
                    <p>Estado: {record.status}</p>
                  </div>
                </div>
                <div style={{ position: "absolute", top: "10px", right: "10px", display: "flex", gap: "5px" }}>
                  <Button type="primary" danger icon={<DeleteOutlined />} size="small" onClick={() => handleDeleteRecord(record.id)} />
                  <Button type="default" icon={<EditOutlined />} size="small" onClick={() => showModal(record)} />
                </div>
              </Card>
            </Col>
          )
        })}
      </Row>

      <Modal
        title={editingRecord ? "Modificar Vacuna" : "Agregar Vacuna"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddOrEditRecord}>
          <Form.Item label="Animal" name="animalId" rules={[{ required: true, message: "Selecciona un animal" }]}>
            <Select placeholder="Selecciona un animal">
              {animals.map(a => (
                <Select.Option key={a.id} value={a.id}>{a.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Vacuna" name="vaccine" rules={[{ required: true, message: "Ingresa el nombre de la vacuna" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Fecha de aplicación" name="date" rules={[{ required: true, message: "Selecciona la fecha" }]}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Próxima dosis" name="nextDate">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Estado" name="status" rules={[{ required: true, message: "Selecciona el estado" }]}>
            <Select placeholder="Selecciona el estado">
              <Select.Option value="Aplicada">Aplicada</Select.Option>
              <Select.Option value="Pendiente">Pendiente</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              {editingRecord ? "Modificar" : "Agregar"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
