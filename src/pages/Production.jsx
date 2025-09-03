//export default function Production(){ return <h2>Producto</h2>; }

import { Card, Row, Col, InputNumber, Button, DatePicker, Table, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import dayjs from "dayjs";

// Imágenes de los animales
const animalImages = {
  Vaca: "./animals/vaca.png",
  Gallina: "./animals/gallina.png",
  Cerdo: "./animals/cerdo.png",
};

// Tipos de producción
const tipos = [
  { name: "Vaca", label: "Litros de leche (L)" },
  { name: "Gallina", label: "Cantidad de huevos" },
  { name: "Cerdo", label: "Cerdos vendidos" },
];

export default function ProduccionDiaria() {
  const [records, setRecords] = useState([]);
  const [fecha, setFecha] = useState(dayjs());
  const [valores, setValores] = useState({ Vaca: 0, Gallina: 0, Cerdo: 0 });
  const [filterDate, setFilterDate] = useState(null);

  // Guardar producción diaria
  const guardarProduccion = () => {
    const dateKey = fecha.format("YYYY-MM-DD");
    const newRecord = { id: dateKey, fecha: dateKey, ...valores };

    // Reemplaza si ya existe registro para la fecha
    setRecords(prev => {
      const other = prev.filter(r => r.id !== dateKey);
      return [newRecord, ...other];
    });

    message.success("Producción diaria guardada");
  };

  // Filtrar registros por fecha
  const filteredRecords = filterDate
    ? records.filter(r => r.fecha === filterDate.format("YYYY-MM-DD"))
    : records;

  // Columnas para la tabla
  const columns = tipos.map(t => ({
    title: (
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <img src={animalImages[t.name]} alt={t.name} style={{ width: 30, height: 30 }} />
        {t.label}
      </div>
    ),
    dataIndex: t.name,
    key: t.name,
  }));

  // Agregar columna de fecha con nombre claro
  columns.unshift({ title: "Fecha de producción", dataIndex: "fecha", key: "fecha" });

  return (
    <div style={{ padding: 20 }}>
      {/* Card para registrar producción */}
      <Card title="Registrar Producción Diaria" style={{ marginBottom: 20 }}>
        <Row gutter={[20, 20]}>
          {/* Fecha arriba */}
          <Col span={24}>
            <div style={{ fontWeight: "bold", marginBottom: 5 }}>📅 Fecha de producción:</div>
            <DatePicker value={fecha} onChange={d => setFecha(d || dayjs())} />
          </Col>

          {/* Campos de producción */}
          {tipos.map(t => (
            <Col xs={24} sm={12} md={8} key={t.name}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: 5 }}>
                <img
                  src={animalImages[t.name]}
                  alt={t.name}
                  style={{ width: 30, height: 30, marginRight: 8 }}
                />
                <span style={{ fontWeight: "bold" }}>{t.label}:</span>
              </div>
              <InputNumber
                min={0}
                value={valores[t.name]}
                onChange={v => setValores({ ...valores, [t.name]: v })}
                placeholder={t.label}
                style={{ width: "100%" }}
              />
            </Col>
          ))}

          {/* Botón guardar */}
          <Col span={24}>
            <Button type="primary" icon={<PlusOutlined />} onClick={guardarProduccion}>
              Guardar Producción
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Filtro por fecha */}
      <Card title="Histórico de Producción">
        <div style={{ marginBottom: 10 }}>
          <DatePicker
            placeholder="Filtrar por fecha"
            value={filterDate}
            onChange={setFilterDate}
            allowClear
          />
        </div>

        <Table
          dataSource={filteredRecords}
          columns={columns}
          pagination={{ pageSize: 5 }}
          rowKey="id"
        />
      </Card>
    </div>
  );
}
