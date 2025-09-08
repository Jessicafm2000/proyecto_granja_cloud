// src/pages/Vaccination.jsx
import { useState, useEffect } from "react";
import { Card, Row, Col, Button, Modal, Form, Select, DatePicker, Input, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { getAnimals, getVaccines, addVaccine, updateVaccine, deleteVaccine } from "../api";
import dayjs from "dayjs";

const { Option } = Select;

export default function Vaccination() {
  const [records, setRecords] = useState([]);
  const [paginationKeys, setPaginationKeys] = useState({ previous: [], current: null, next: null });
  const [loading, setLoading] = useState(false);

  const [animals, setAnimals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAnimalType, setFilterAnimalType] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);
  const [filterVaccine, setFilterVaccine] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();

  const vaccineOptions = ["Fiebre Aftosa", "Brucelosis", "Gripe Aviar", "Peste Porcina"];

  const animalImages = {
    Vaca: "https://d2trfafuwnq9hu.cloudfront.net/animals/vaca.png",
    Gallina: "https://d2trfafuwnq9hu.cloudfront.net/animals/gallina.png",
    Cerdo: "https://d2trfafuwnq9hu.cloudfront.net/animals/cerdo.png",
  };

  // ---------- Cargar animales ----------
  useEffect(() => {
    async function fetchData() {
      try {
        const animalData = await getAnimals(); 
        const animalsArray = (animalData?.items || []).map(a => ({
          ...a,
          id: Number(a.id),
          img: animalImages[a.tipo] || "https://d2trfafuwnq9hu.cloudfront.net/animals/default.png",
        }));
        setAnimals(animalsArray);

        await fetchVaccines(); 
      } catch (error) {
        console.error("Error cargando datos:", error);
        message.error("Error cargando datos");
      }
    }
    fetchData();
  }, []);

  // ---------- Cargar vacunas ----------
  const fetchVaccines = async (exclusiveStartKey = null, direction = "current") => {
    try {
      setLoading(true);
      const vaccineData = await getVaccines(10, exclusiveStartKey);
      const normalized = (vaccineData.items || []).map(v => ({
        ...v,
        animalId: Number(v.animalId),
      }));
      setRecords(normalized);

      // Manejar claves de paginación
      setPaginationKeys(prev => {
        const newPrev = direction === "next" && prev.current ? [...prev.previous, prev.current] : prev.previous;
        const newCurrent = vaccineData.lastKey ? vaccineData.lastKey : null;
        return { previous: newPrev, current: vaccineData.lastKey ? vaccineData.lastKey : null, next: vaccineData.lastKey };
      });
    } catch (error) {
      console.error("Error cargando vacunas:", error);
      message.error("Error cargando vacunas");
    } finally {
      setLoading(false);
    }
  };

  // ---------- Filtros ----------
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
  const openModal = (record = null) => {
    setEditingRecord(record);
    setIsModalOpen(true);
    if (record) {
      form.setFieldsValue({
        ...record,
        date: dayjs(record.date),
        nextDate: record.nextDate ? dayjs(record.nextDate) : null,
      });
    } else {
      form.resetFields();
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
    form.resetFields();
  };

  // ---------- Agregar / Modificar vacuna ----------
  const handleSave = async (values) => {
    try {
      const payload = {
        ...values,
        date: values.date.format("YYYY-MM-DD"),
        nextDate: values.nextDate ? values.nextDate.format("YYYY-MM-DD") : "",
      };

      if (editingRecord) {
        await updateVaccine({ id: editingRecord.id, ...payload });
        message.success("Vacuna modificada correctamente");
      } else {
        await addVaccine(payload);
        message.success("Vacuna agregada correctamente");
      }

      await fetchVaccines();
      handleCancel();
    } catch (error) {
      console.error("Error guardando vacuna:", error);
      message.error("Error al guardar vacuna");
    }
  };

  // ---------- Eliminar vacuna ----------
  const handleDelete = async (id) => {
    try {
      await deleteVaccine(id);
      message.success("Vacuna eliminada correctamente");
      await fetchVaccines();
    } catch (error) {
      console.error("Error eliminando vacuna:", error);
      message.error("Error al eliminar vacuna");
    }
  };

  // ---------- Navegación de paginación ----------
  const handleNext = () => {
    if (paginationKeys.next) {
      fetchVaccines(paginationKeys.next, "next");
    }
  };

  const handlePrevious = () => {
    const prevKeys = [...paginationKeys.previous];
    const last = prevKeys.pop();
    if (last) fetchVaccines(last, "prev");
    setPaginationKeys(prev => ({ ...prev, previous: prevKeys }));
  };

  return (
    <div style={{ padding: 20 }}>
      {/* Filtros y búsqueda */}
      <div style={{ marginBottom: 20, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Input
          placeholder="Buscar vacuna"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ width: 200 }}
        />
        <Select
          placeholder="Filtrar por tipo de animal"
          allowClear
          style={{ width: 180 }}
          onChange={value => setFilterAnimalType(value)}
        >
          {["Vaca", "Gallina", "Cerdo"].map(type => (
            <Option key={type} value={type}>{type}</Option>
          ))}
        </Select>
        <Select
          placeholder="Filtrar por estado"
          allowClear
          style={{ width: 180 }}
          onChange={value => setFilterStatus(value)}
        >
          <Option value="Aplicada">Aplicada</Option>
          <Option value="Pendiente">Pendiente</Option>
        </Select>
        <Select
          placeholder="Filtrar por vacuna"
          allowClear
          style={{ width: 180 }}
          onChange={value => setFilterVaccine(value)}
        >
          {vaccineOptions.map(v => (
            <Option key={v} value={v}>{v}</Option>
          ))}
        </Select>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
          Agregar Vacuna
        </Button>
      </div>

      {/* Cards de vacunas */}
      <Row gutter={[16, 16]}>
        {filteredRecords.map(record => {
          const animal = animals.find(a => a.id === record.animalId) || {
            nombre: "Desconocido",
            tipo: "N/A",
            img: "https://d2trfafuwnq9hu.cloudfront.net/animals/default.png"
          };
          return (
            <Col key={record.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                style={{ position: "relative", transition: "all 0.3s ease" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <img src={animal.img} alt={animal.nombre} style={{ width: 50, height: 50, objectFit: "contain" }} />
                  <div>
                    <h3>{record.vaccine}</h3>
                    <p>Animal: {animal.nombre} ({animal.tipo})</p>
                    <p>Fecha: {record.date}</p>
                    <p>Próxima dosis: {record.nextDate || "-"}</p>
                    <p>Estado: {record.status}</p>
                  </div>
                </div>
                <div style={{ position: "absolute", top: 10, right: 10, display: "flex", gap: 5 }}>
                  <Button icon={<EditOutlined />} size="small" onClick={() => openModal(record)} />
                  <Button icon={<DeleteOutlined />} size="small" danger onClick={() => handleDelete(record.id)} />
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Botones de paginación */}
      <div style={{ marginTop: 16, display: "flex", justifyContent: "center", gap: 10 }}>
        <Button onClick={handlePrevious} disabled={paginationKeys.previous.length === 0}>
          Anterior
        </Button>
        <Button onClick={handleNext} disabled={!paginationKeys.next}>
          Siguiente
        </Button>
      </div>

      {/* Modal */}
      <Modal
        title={editingRecord ? "Editar Vacuna" : "Agregar Vacuna"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item name="animalId" label="Animal" rules={[{ required: true }]}>
            <Select placeholder="Selecciona un animal">
              {animals.map(a => (
                <Option key={a.id} value={a.id}>{a.nombre} ({a.tipo})</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="vaccine" label="Vacuna" rules={[{ required: true }]}>
            <Select placeholder="Selecciona una vacuna">
              {vaccineOptions.map(v => (
                <Option key={v} value={v}>{v}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="date" label="Fecha de aplicación" rules={[{ required: true }]}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="nextDate" label="Próxima dosis">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="status" label="Estado" rules={[{ required: true }]}>
            <Select placeholder="Selecciona el estado">
              <Option value="Aplicada">Aplicada</Option>
              <Option value="Pendiente">Pendiente</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              {editingRecord ? "Modificar" : "Agregar"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <style jsx>{`
        .ant-card:hover {
          transform: scale(1.05);
          background-color: #f0f9ff;
          border-color: #40a9ff;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
      `}</style>
    </div>
  );
}
