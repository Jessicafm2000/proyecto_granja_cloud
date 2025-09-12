import { useState, useEffect } from "react";
import { Card, Row, Col, Input, Button, Modal, Form, Select, DatePicker, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { getAllAnimals, getVaccines, addVaccine, updateVaccine, deleteVaccine } from "../api";
import dayjs from "dayjs";

const { Option } = Select;

export default function Vaccination() {
  const limit = 12; // vacunas por página
  const vaccineOptions = ["Fiebre Aftosa", "Brucelosis", "Gripe Aviar", "Peste Porcina","Encefalomielitis Equina (Caballos/Burros)", "Mixomatosis (Conejo)", "Enfermedad Hemorrágica Viral del Conejo (Conejo)"];

  const animalImages = {
    Vaca: "https://d2trfafuwnq9hu.cloudfront.net/animals/vaca.png",
    Gallina: "https://d2trfafuwnq9hu.cloudfront.net/animals/gallina.png",
    Cerdo: "https://d2trfafuwnq9hu.cloudfront.net/animals/cerdo.png",
    Burro: "https://d2trfafuwnq9hu.cloudfront.net/animals/burro.png",
    Caballo: "https://d2trfafuwnq9hu.cloudfront.net/animals/caballo.png",
    Cabra: "https://d2trfafuwnq9hu.cloudfront.net/animals/cabra.png",
    Conejo: "https://d2trfafuwnq9hu.cloudfront.net/animals/conejo.png",
    Cuy: "https://d2trfafuwnq9hu.cloudfront.net/animals/cuy.png",
    Oveja: "https://d2trfafuwnq9hu.cloudfront.net/animals/oveja.png",
    Pato: "https://d2trfafuwnq9hu.cloudfront.net/animals/pato.png",
    Default: "https://d2trfafuwnq9hu.cloudfront.net/animals/default.png",
  };

  const [records, setRecords] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAnimalType, setFilterAnimalType] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);
  const [filterVaccine, setFilterVaccine] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();

  // --- Paginación ---
  const [historyKeys, setHistoryKeys] = useState([null]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastKey, setLastKey] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  // ---------- Cargar animales ----------
  useEffect(() => {
    async function fetchAnimals() {
      try {
        const allAnimals = await getAllAnimals();
        const animalsArray = (allAnimals || []).map(a => ({
          ...a,
          id: Number(a.id),
          img: animalImages[a.tipo] || animalImages.Default,
        }));
        setAnimals(animalsArray);
        await loadVaccines();
      } catch (error) {
        console.error(error);
        message.error("Error cargando animales");
      }
    }
    fetchAnimals();
  }, []);

  // ---------- Cargar vacunas ----------
  const loadVaccines = async (direction = "current") => {
    let keyToLoad = null;
    if (direction === "next") {
      if (!lastKey) return;
      keyToLoad = lastKey;
    } else if (direction === "prev") {
      if (currentIndex === 0) return;
      keyToLoad = historyKeys[currentIndex - 1];
    }

    try {
      const data = await getVaccines(limit, keyToLoad);
      if (!data) return;

      const formatted = (data.items || []).map(v => ({
        ...v,
        animalId: Number(v.animalId),
      }));

      setRecords(formatted);
      setLastKey(data.lastKey || null);

      // Actualizar historial e índice
      if (direction === "next") {
        setHistoryKeys([...historyKeys.slice(0, currentIndex + 1), keyToLoad]);
        setCurrentIndex(prev => prev + 1);
      } else if (direction === "prev") {
        setCurrentIndex(prev => prev - 1);
      } else {
        setHistoryKeys([null]);
        setCurrentIndex(0);
      }

      // Actualizar totalPages
      if (data.totalCount) {
        setTotalPages(Math.ceil(data.totalCount / limit));
      } else {
        setTotalPages(historyKeys.length + (data.lastKey ? 1 : 0));
      }
    } catch (error) {
      console.error(error);
      message.error("Error cargando vacunas");
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
    if (animals.length === 0) {
      message.warning("Cargando animales, espera un momento...");
      return;
    }

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

  // ---------- Agregar / Editar ----------
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
      await loadVaccines();
      handleCancel();
    } catch (error) {
      console.error(error);
      message.error("Error al guardar vacuna");
    }
  };

  // ---------- Eliminar ----------
  const handleDelete = async (id) => {
    try {
      await deleteVaccine(id);
      message.success("Vacuna eliminada correctamente");
      await loadVaccines();
    } catch (error) {
      console.error(error);
      message.error("Error al eliminar vacuna");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Filtros */}
      <div style={{ marginBottom: 20, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Input
          placeholder="Buscar vacuna"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ width: 250 }}
          prefix={<SearchOutlined />}
        />
        <Select placeholder="Filtrar por tipo de animal" allowClear style={{ width: 180 }} onChange={setFilterAnimalType}>
          {["Vaca", "Gallina", "Cerdo", "Burro", "Caballo", "Cabra", "Conejo", "Cuy", "Oveja", "Pato"].map(type => <Option key={type} value={type}>{type}</Option>)}
        </Select>
        <Select placeholder="Filtrar por estado" allowClear style={{ width: 180 }} onChange={setFilterStatus}>
          <Option value="Aplicada">Aplicada</Option>
          <Option value="Pendiente">Pendiente</Option>
        </Select>
        <Select placeholder="Filtrar por vacuna" allowClear style={{ width: 180 }} onChange={setFilterVaccine}>
          {vaccineOptions.map(v => <Option key={v} value={v}>{v}</Option>)}
        </Select>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>Agregar Vacuna</Button>
      </div>

      {/* Cards */}
      <Row gutter={[16, 16]}>
        {filteredRecords.map(record => {
          const animal = animals.find(a => a.id === record.animalId) || { nombre: "Desconocido", tipo: "N/A", img: animalImages.Default };
          return (
            <Col key={record.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                style={{ position: "relative", transition: "all 0.3s ease" }}
                extra={
                  <>
                    <EditOutlined style={{ marginRight: 8, cursor: "pointer" }} onClick={() => openModal(record)} />
                    <DeleteOutlined style={{ color: "red", cursor: "pointer" }} onClick={() => handleDelete(record.id)} />
                  </>
                }
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img src={animal.img} alt={animal.nombre} style={{ width: 50, height: 50, objectFit: "contain", marginRight: 10 }} />
                  <div>
                    <h3 style={{ margin: 0 }}>{record.vaccine}</h3>
                    <p style={{ margin: 0 }}>{animal.nombre} ({animal.tipo})</p>
                    <p style={{ margin: 0 }}>Fecha: {record.date}</p>
                    <p style={{ margin: 0 }}>Próxima dosis: {record.nextDate || "-"}</p>
                    <p style={{ margin: 0 }}>Estado: {record.status}</p>
                  </div>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Paginación */}
      <div style={{ textAlign: "center", marginTop: 20, display: "flex", justifyContent: "center", gap: 10, alignItems: "center" }}>
        <Button disabled={currentIndex === 0} onClick={() => loadVaccines("prev")}>Anterior</Button>
        <span>Página {currentIndex + 1} </span>
        <Button disabled={!lastKey} onClick={() => loadVaccines("next")}>Siguiente</Button>
      </div>

      {/* Modal */}
      <Modal title={editingRecord ? "Modificar Vacuna" : "Agregar Vacuna"} open={isModalOpen} onCancel={handleCancel} footer={null}>
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item name="animalId" label="Animal" rules={[{ required: true }]}>
            <Select
              placeholder="Selecciona un animal"
              showSearch
              optionFilterProp="children"
              virtual={false} // todos los animales visibles
              style={{ width: "100%" }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }} // scroll si hay muchos animales
            >
              {animals.map(a => (
                <Option key={a.id} value={a.id}>
                  {a.nombre} ({a.tipo})
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="vaccine" label="Vacuna" rules={[{ required: true }]}>
            <Select placeholder="Selecciona una vacuna">
              {vaccineOptions.map(v => <Option key={v} value={v}>{v}</Option>)}
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
    </div>
  );
}
