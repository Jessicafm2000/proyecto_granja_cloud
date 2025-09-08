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

import {
  getProduction,
  addProduction,
  updateProduction,
  deleteProduction,
} from "../api";

const animalImages = {
  Vaca: "https://d2trfafuwnq9hu.cloudfront.net/animals/vaca.png",
  Gallina: "https://d2trfafuwnq9hu.cloudfront.net/animals/gallina.png",
  Cerdo: "https://d2trfafuwnq9hu.cloudfront.net/animals/cerdo.png",
};

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

  // ================= PAGINACIÓN =================
  const pageSize = 5;
  const [historyKeys, setHistoryKeys] = useState([null]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastKey, setLastKey] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  // ================= API CALLS =================
  const fetchRecords = async (direction = "current") => {
    let keyToLoad = null;
    if (direction === "next") {
      if (!lastKey) return;
      keyToLoad = lastKey;
    } else if (direction === "prev") {
      if (currentIndex === 0) return;
      keyToLoad = historyKeys[currentIndex - 1];
    }

    try {
      const data = await getProduction(pageSize, keyToLoad);
      if (!data) return;

      const formatted = (data.items || []).map((r) => ({
        ...r,
        id: String(r.id),
        milk: Number(r.milk) || 0,
        eggs: Number(r.eggs) || 0,
        pigsSold: Number(r.pigsSold) || 0,
      }));

      setRecords(formatted);
      setLastKey(data.lastKey || null);

      // Actualizar historial e índice
      if (direction === "next") {
        const newHistory = [...historyKeys.slice(0, currentIndex + 1), keyToLoad];
        setHistoryKeys(newHistory);
        setCurrentIndex((prev) => prev + 1);
      } else if (direction === "prev") {
        setCurrentIndex((prev) => prev - 1);
      } else {
        setHistoryKeys([null]);
        setCurrentIndex(0);
      }

      // totalPages basado en totalCount real
      if (data.totalCount != null) {
        setTotalPages(Math.ceil(data.totalCount / pageSize));
      } else {
        // fallback: usa páginas conocidas
        setTotalPages(historyKeys.length + (data.lastKey ? 1 : 1));
      }
    } catch (err) {
      console.error("fetchRecords:", err);
      message.error("Error al cargar la producción");
    }
  };

  const guardarProduccion = async () => {
    const dateKey = fecha.format("YYYY-MM-DD");

    const existe = records.some((r) => r.date === dateKey);
    if (existe) {
      message.warning("Ya existe producción para esta fecha");
      return;
    }

    try {
      const payload = {
        date: dateKey,
        milk: Number(valores.milk) || 0,
        eggs: Number(valores.eggs) || 0,
        pigsSold: Number(valores.pigsSold) || 0,
      };

      const result = await addProduction(payload);
      if (result && !result.error) {
        message.success("Producción guardada");
        fetchRecords("current");
        setValores({ milk: 0, eggs: 0, pigsSold: 0 });
      } else {
        message.error(result?.error || "Error al guardar producción");
      }
    } catch (err) {
      console.error("guardarProduccion:", err);
      message.error("Error de conexión");
    }
  };

  const handleSaveEdit = async () => {
    try {
      const values = await form.validateFields();
      const updated = {
        id: String(editingRecord.id),
        date: editingRecord.date,
        milk: Number(values.milk) || 0,
        eggs: Number(values.eggs) || 0,
        pigsSold: Number(values.pigsSold) || 0,
      };

      const result = await updateProduction(updated);
      if (result && !result.error) {
        message.success("Producción actualizada");
        fetchRecords("current");
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

  const eliminarProduccionRecord = async (id) => {
    try {
      const result = await deleteProduction(id);
      if (result) {
        message.success("Registro eliminado");
        fetchRecords("current");
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
                onChange={(v) => setValores({ ...valores, [t.name]: v || 0 })}
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

        <Table dataSource={filteredRecords} columns={columns} pagination={false} rowKey="id" />

        <div style={{ marginTop: 16, display: "flex", justifyContent: "center", gap: 10, alignItems: "center" }}>
          <Button disabled={currentIndex === 0} onClick={() => fetchRecords("prev")}>
            Anterior
          </Button>

          <span>Página {currentIndex + 1}</span>

          <Button disabled={!lastKey} onClick={() => fetchRecords("next")}>
            Siguiente
          </Button>
        </div>
      </Card>

      <Modal
        title="Modificar Producción"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSaveEdit}
        okText="Guardar"
      >
        <Form form={form} layout="vertical">
          {tipos.map((t) => (
            <Form.Item key={t.name} label={t.label} name={t.name} rules={[{ required: true, message: "Ingresa un valor" }]}>
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          ))}
        </Form>
      </Modal>
    </div>
  );
}
