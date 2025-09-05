//export default function Crops(){ return <h2>Cultivos</h2>; }
import { Card, Row, Col, Input, Button, Modal, Form, Select, message } from "antd";
import { SearchOutlined, PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";

// Mapea los cultivos a imágenes
const cropImages = {
  Maíz: "./crops/maiz.png",
  Trigo: "./crops/trigo.png",
  Tomate: "./crops/tomate.png",
  Papa: "./crops/papa.png",
  Default: "./crops/default.png",
};

export default function Crops() {
  const cropOptions = ["Maíz", "Trigo", "Tomate", "Papa"];
  const estadoOptions = ["Semilla", "Creciendo", "Cosecha"];

  const [crops, setCrops] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCrop, setFilterCrop] = useState(null);
  const [filterEstado, setFilterEstado] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCrop, setEditingCrop] = useState(null);
  const [form] = Form.useForm();

  const apiUrl = "https://8xqk2pb1wd.execute-api.us-east-1.amazonaws.com/dev/crops"; // <- tu endpoint Lambda

  // Cargar cultivos
  const loadCrops = async () => {
    try {
      const res = await fetch(apiUrl);
      const data = await res.json();
      const formatted = data.map((c) => ({
        id: parseInt(c.id.N || c.id),
        name: c.name?.S || c.name,
        estado: c.estado?.S || c.estado,
        siembra: c.siembra?.S || c.siembra,
        hectareas: parseInt(c.hectareas?.N || c.hectareas),
        img: cropImages[c.name?.S || c.name] || cropImages.Default,
      }));
      setCrops(formatted);
    } catch (err) {
      console.error(err);
      message.error("Error cargando los cultivos");
    }
  };

  useEffect(() => {
    loadCrops();
  }, []);

  // Modal
  const showModal = (crop = null) => {
    if (crop) {
      setEditingCrop(crop);
      form.setFieldsValue({
        name: crop.name,
        estado: crop.estado,
        siembra: crop.siembra,
        hectareas: crop.hectareas,
      });
    } else {
      setEditingCrop(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingCrop(null);
    form.resetFields();
  };

  // Agregar o editar
  const handleAddOrEditCrop = async (values) => {
    try {
      const method = editingCrop ? "PUT" : "POST";
      const body = editingCrop ? { ...values, id: editingCrop.id } : values;

      const res = await fetch(apiUrl, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Error en la operación");

      const image = cropImages[values.name] || cropImages.Default;

      if (editingCrop) {
        setCrops((prev) =>
          prev.map((c) => (c.id === editingCrop.id ? { ...c, ...values, img: image } : c))
        );
      } else {
        const newId = result.id;
        setCrops((prev) => [{ id: newId, ...values, img: image }, ...prev]);
      }

      message.success(result.message);
      handleCancel();
    } catch (err) {
      console.error(err);
      message.error(err.message);
    }
  };

  // Eliminar
  const handleDeleteCrop = async (id) => {
    try {
      const res = await fetch(`${apiUrl}?id=${id}`, { method: "DELETE" });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Error eliminando cultivo");

      setCrops((prev) => prev.filter((c) => c.id !== id));
      message.success(result.message);
    } catch (err) {
      console.error(err);
      message.error(err.message);
    }
  };

  // Filtros
  const filteredCrops = crops.filter(
    (c) =>
      c.name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!filterCrop || c.name === filterCrop) &&
      (!filterEstado || c.estado === filterEstado)
  );

  return (
    <div style={{ padding: "20px" }}>
      {/* Filtros y botón agregar */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <Input
          placeholder="Buscar cultivo por nombre"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "250px" }}
          prefix={<SearchOutlined />}
        />
        <Select
          placeholder="Filtrar por cultivo"
          style={{ width: "150px" }}
          allowClear
          onChange={(value) => setFilterCrop(value)}
        >
          {cropOptions.map((option) => (
            <Select.Option key={option} value={option}>
              {option}
            </Select.Option>
          ))}
        </Select>
        <Select
          placeholder="Filtrar por estado"
          style={{ width: "150px" }}
          allowClear
          onChange={(value) => setFilterEstado(value)}
        >
          {estadoOptions.map((option) => (
            <Select.Option key={option} value={option}>
              {option}
            </Select.Option>
          ))}
        </Select>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
          Agregar Cultivo
        </Button>
      </div>

      {/* Cards */}
      <Row gutter={[16, 16]}>
        {filteredCrops.map((crop) => (
          <Col key={crop.id} xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              style={{ transition: "all 0.3s ease", position: "relative" }}
              extra={
                <>
                  <EditOutlined style={{ marginRight: 8, cursor: "pointer" }} onClick={() => showModal(crop)} />
                  <DeleteOutlined style={{ color: "red", cursor: "pointer" }} onClick={() => handleDeleteCrop(crop.id)} />
                </>
              }
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  alt={crop.name}
                  src={crop.img}
                  style={{ width: 60, height: 60, objectFit: "contain", marginRight: 10 }}
                />
                <div>
                  <h3 style={{ margin: 0 }}>{crop.name}</h3>
                  <p style={{ margin: 0, color: "#666" }}>Estado: {crop.estado}</p>
                  <p style={{ margin: 0, color: "#666" }}>Siembra: {crop.siembra}</p>
                  <p style={{ margin: 0, color: "#666" }}>Hectáreas: {crop.hectareas}</p>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal */}
      <Modal title={editingCrop ? "Modificar Cultivo" : "Agregar Cultivo"} open={isModalOpen} onCancel={handleCancel} footer={null}>
        <Form form={form} layout="vertical" onFinish={handleAddOrEditCrop}>
          <Form.Item label="Nombre" name="name" rules={[{ required: true, message: "Selecciona el cultivo" }]}>
            <Select placeholder="Selecciona cultivo">{cropOptions.map((option) => <Select.Option key={option} value={option}>{option}</Select.Option>)}</Select>
          </Form.Item>

          <Form.Item label="Estado" name="estado" rules={[{ required: true, message: "Selecciona el estado" }]}>
            <Select placeholder="Selecciona estado">{estadoOptions.map((option) => <Select.Option key={option} value={option}>{option}</Select.Option>)}</Select>
          </Form.Item>

          <Form.Item label="Fecha de siembra" name="siembra" rules={[{ required: true, message: "Ingresa la fecha de siembra" }]}>
            <Input type="date" />
          </Form.Item>

          <Form.Item label="Hectáreas" name="hectareas" rules={[{ required: true, message: "Ingresa la cantidad en hectáreas" }]}>
            <Input type="number" min={0} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              {editingCrop ? "Modificar" : "Agregar"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
