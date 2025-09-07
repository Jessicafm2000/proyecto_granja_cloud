// src/pages/Vaccination.jsx
import { Card, Row, Col, Input, Button, Modal, Form, Select, DatePicker, message } from "antd";
import { SearchOutlined, PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { getVaccines, addVaccine, updateVaccine, deleteVaccine, getAnimals } from "../api";

export default function Vaccination() {
  const [records, setRecords] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAnimalType, setFilterAnimalType] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);
  const [filterVaccine, setFilterVaccine] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();

  const vaccineOptions = ["Fiebre Aftosa", "Brucelosis", "Gripe Aviar", "Peste Porcina"];

  // URL base del bucket S3
  const S3_URL = "https://d2trfafuwnq9hu.cloudfront.net";

  // ---------- Cargar animales y vacunas ----------
  useEffect(() => {
    async function fetchData() {
      try {
        const [animalData, vaccineData] = await Promise.all([getAnimals(), getVaccines()]);

        const animalsWithImg = (animalData || []).map(a => ({
          ...a,
          img: `${S3_URL}/animals/${a.tipo.toLowerCase()}.png`
        }));

        setAnimals(animalsWithImg);
        setRecords(vaccineData || []);
      } catch (error) {
        console.error("Error cargando datos:", error);
        message.error("Error cargando datos");
      }
    }
    fetchData();
  }, []);

  // ---------- Filtrar registros ----------
  const filteredRecords = records.filter(record => {
    const animal = animals.find(a => a.id === record.animalId);
    return (
      record.vaccine.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterAnimalType ? animal?.tipo === filterAnimalType : true) &&
      (filterStatus ? record.status === filterStatus : true) &&
      (filterVaccine ? record.vaccine === filterVaccine : true)
    );
  });

  // ---------- Modal ----------
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

  // ---------- Agregar / Editar ----------
  const handleAddOrEditRecord = async (values) => {
    try {
      if (editingRecord) {
        await updateVaccine({
          id: editingRecord.id,
          animalId: values.animalId,
          vaccine: values.vaccine,
          date: values.date.format("YYYY-MM-DD"),
          nextDate: values.nextDate ? values.nextDate.format("YYYY-MM-DD") : null,
          status: values.status,
        });
        message.success("Vacuna modificada correctamente");
      } else {
        await addVaccine({
          animalId: values.animalId,
          vaccine: values.vaccine,
          date: values.date.format("YYYY-MM-DD"),
          nextDate: values.nextDate ? values.nextDate.format("YYYY-MM-DD") : null,
          status: values.status,
        });
        message.success("Vacuna agregada correctamente");
      }
      const updatedRecords = await getVaccines();
      setRecords(updatedRecords || []);
      handleCancel();
    } catch (error) {
      console.error("Error al agregar/editar vacuna:", error);
      message.error("Error al agregar/editar vacuna");
    }
  };

  // ---------- Eliminar ----------
  const handleDeleteRecord = async (id) => {
    try {
      await deleteVaccine(id);
      message.success("Vacuna eliminada correctamente");
      const updatedRecords = await getVaccines();
      setRecords(updatedRecords || []);
    } catch (error) {
      console.error("Error al eliminar vacuna:", error);
      message.error("Error al eliminar vacuna");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Filtros */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <Input
          placeholder="Buscar vacuna"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "200px" }}
          prefix={<SearchOutlined />}
        />
        <Select
          placeholder="Filtrar por tipo de animal"
          style={{ width: "180px" }}
          allowClear
          onChange={value => setFilterAnimalType(value)}
        >
          {["Vaca", "Gallina", "Cerdo"].map(type => (
            <Select.Option key={type} value={type}>
              {type}
            </Select.Option>
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
        <Select
          placeholder="Filtrar por vacuna"
          style={{ width: "180px" }}
          allowClear
          onChange={value => setFilterVaccine(value)}
        >
          {vaccineOptions.map(v => (
            <Select.Option key={v} value={v}>{v}</Select.Option>
          ))}
        </Select>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
          Agregar Vacuna
        </Button>
      </div>

      {/* Tarjetas de registros */}
      <Row gutter={[16, 16]}>
        {filteredRecords.map(record => {
          const animal = animals.find(a => a.id === record.animalId) || { 
            nombre: "Desconocido", 
            tipo: "N/A", 
            img: `${S3_URL}/animals/default.png`
          };
          return (
            <Col key={record.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                className="vaccination-card"
                style={{ position: "relative", transition: "all 0.3s ease" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <img
                    src={animal.img}
                    alt={animal.nombre}
                    style={{ width: "50px", height: "50px", objectFit: "contain" }}
                  />
                  <div>
                    <h3>{record.vaccine}</h3>
                    <p>Animal: {animal.nombre} ({animal.tipo})</p>
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
          );
        })}
      </Row>

      {/* Modal */}
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
                <Select.Option key={a.id} value={a.id}>{a.nombre} ({a.tipo})</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Vacuna" name="vaccine" rules={[{ required: true, message: "Selecciona una vacuna" }]}>
            <Select placeholder="Selecciona una vacuna">
              {vaccineOptions.map(v => (
                <Select.Option key={v} value={v}>{v}</Select.Option>
              ))}
            </Select>
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

      {/* Estilos para hover */}
      <style jsx>{`
        .vaccination-card:hover {
          transform: scale(1.05);
          background-color: #f0f9ff !important;
          border-color: #40a9ff !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </div>
  );
}
