// src/pages/ProduccionDiaria.jsx
import {
  Card,
  Row,
  Col,
  InputNumber,
  Button,
  DatePicker,
  Table,
  Modal,
  Form,
  message,
  Popconfirm,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import dayjs from "dayjs";

// 👇 Importamos funciones de api.js
import {
  getProduction,
  addProduction,
  updateProduction,
  deleteProduction,
} from "../api";

// Imágenes de los animales
const animalImages = {
  Vaca: "./animals/vaca.png",
  Gallina: "./animals/gallina.png",
  Cerdo: "./animals/cerdo.png",
};

// Tipos de producción
const tipos = [
  { name: "milk", label: "Litros de leche (L)", img: "Vaca" },
  { name: "eggs", label: "Cantidad de huevos", img: "Gallina" },
  { name: "pigsSold", label: "Cerdos vendidos", img: "Cerdo" },
];

export default function ProduccionDiaria() {
  const [records, setRecords] = useState([]);
  const [fecha, setFecha] = useState(dayjs());
  const [valores, setValores] = useState({ milk: 0, eggs: 0, pigsSold: 0 });
  const [filterDate, setFilterDate] = useState(null);

  const [editingRecord, setEditingRecord] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  // ================= API CALLS =================
  const fetchRecords = async () => {
    try {
      const items = await getProduction();
      setRecords(items);
    } catch (err) {
      console.error("fetchRecords:", err);
      message.error("Error al cargar la producción");
    }
  };

  // Guardar producción
  const guardarProduccion = async () => {
    const dateKey = fecha.format("YYYY-MM-DD");

    const existe = records.some((r) => r.date === dateKey);
    if (existe) {
      message.warning("Ya existe producción para esta fecha");
      return;
    }

    try {
      const result = await addProduction({ date: dateKey, ...valores });
      if (result && !result.error) {
        message.success("Producción guardada");
        fetchRecords();
        setValores({ milk: 0, eggs: 0, pigsSold: 0 });
      } else {
        message.error(result?.error || "Error al guardar producción");
      }
    } catch (err) {
      console.error("guardarProduccion:", err);
      message.error("Error de conexión");
    }
  };

  // Editar producción
  const handleSaveEdit = async () => {
    try {
      const values = await form.validateFields();
      // Mantener la fecha original como string
      const updated = { id: editingRecord.id, date: editingRecord.date, ...values };

      const result = await updateProduction(updated);
      if (result && !result.error) {
        message.success("Producción actualizada");
        fetchRecords();
        setIsModalOpen(false);
        setEditingRecord(null);
      } else {
        message.error(result?.error || "Error al actualizar producción");
      }
    } catch (err) {
      console.error("handleSaveEdit:", err);
      message.error("Error de conexión");
    }
  };

  // Eliminar producción
  const eliminarProduccionRecord = async (id) => {
    try {
      const result = await deleteProduction(id);
      if (result) {
        message.success("Registro eliminado");
        fetchRecords();
      } else {
        message.error("Error al eliminar");
      }
    } catch (err) {
      console.error("eliminarProduccionRecord:", err);
      message.error("Error de conexión");
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // ================= TABLA =================
  const filteredRecords = filterDate
    ? records.filter((r) => r.date === filterDate.format("YYYY-MM-DD"))
    : records;

  const columns = [
    { title: "Fecha de producción", dataIndex: "date", key: "date" },
    ...tipos.map((t) => ({
      title: (
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <img src={animalImages[t.img]} alt={t.name} style={{ width: 30, height: 30 }} />
          {t.label}
        </div>
      ),
      dataIndex: t.name,
      key: t.name,
    })),
    {
      title: "Acciones",
      key: "acciones",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingRecord(record);
              form.setFieldsValue({
                milk: record.milk,
                eggs: record.eggs,
                pigsSold: record.pigsSold,
              });
              setIsModalOpen(true);
            }}
          >
            Modificar
          </Button>
          <Popconfirm
            title="¿Eliminar registro?"
            onConfirm={() => eliminarProduccionRecord(record.id)}
            okText="Sí, eliminar"
            cancelText="Cancelar"
          >
            <Button danger icon={<DeleteOutlined />}>
              Eliminar
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  // ================= RENDER =================
  return (
    <div style={{ padding: 20 }}>
      <Card title="Registrar Producción Diaria" style={{ marginBottom: 20 }}>
        <Row gutter={[20, 20]}>
          <Col span={24}>
            <div style={{ fontWeight: "bold", marginBottom: 5 }}>📅 Fecha de producción:</div>
            <DatePicker value={fecha} onChange={(d) => setFecha(d || dayjs())} />
          </Col>

          {tipos.map((t) => (
            <Col xs={24} sm={12} md={8} key={t.name}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: 5 }}>
                <img src={animalImages[t.img]} alt={t.name} style={{ width: 30, height: 30, marginRight: 8 }} />
                <span style={{ fontWeight: "bold" }}>{t.label}:</span>
              </div>
              <InputNumber
                min={0}
                value={valores[t.name]}
                onChange={(v) => setValores({ ...valores, [t.name]: v })}
                style={{ width: "100%" }}
              />
            </Col>
          ))}

          <Col span={24}>
            <Button type="primary" icon={<PlusOutlined />} onClick={guardarProduccion}>
              Guardar Producción
            </Button>
          </Col>
        </Row>
      </Card>

      <Card title="Histórico de Producción">
        <div style={{ marginBottom: 10 }}>
          <DatePicker placeholder="Filtrar por fecha" value={filterDate} onChange={setFilterDate} allowClear />
        </div>

        <Table dataSource={filteredRecords} columns={columns} pagination={{ pageSize: 5 }} rowKey="id" />
      </Card>

      <Modal
        title="Modificar Producción"
        open={isModalOpen}
        onOk={handleSaveEdit}
        onCancel={() => setIsModalOpen(false)}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical">
          {tipos.map((t) => (
            <Form.Item key={t.name} label={t.label} name={t.name} rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          ))}
        </Form>
      </Modal>
    </div>
  );
}
