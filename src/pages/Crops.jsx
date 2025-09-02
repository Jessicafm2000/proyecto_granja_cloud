//export default function Crops(){ return <h2>Cultivos</h2>; }
import { Card, Row, Col, Input, Button, Modal, Form, Select } from "antd";
import { SearchOutlined, PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useState } from "react";

export default function Cultivos() {
  const cropOptions = ["Maíz", "Trigo", "Tomate", "Papa"];
  const estadoOptions = ["Semilla", "Creciendo", "Cosecha"];

  const initialCrops = [
    { id: 1, name: "Maíz", siembra: "2025-03-01", estado: "Creciendo", hectareas: 10 },
    { id: 2, name: "Trigo", siembra: "2025-02-15", estado: "Semilla", hectareas: 5 },
    { id: 3, name: "Tomate", siembra: "2025-04-01", estado: "Creciendo", hectareas: 8 },
    { id: 4, name: "Papa", siembra: "2025-01-20", estado: "Cosecha", hectareas: 12 },
    { id: 5, name: "Maíz", siembra: "2025-03-15", estado: "Semilla", hectareas: 7 },
    { id: 6, name: "Trigo", siembra: "2025-02-25", estado: "Creciendo", hectareas: 6 },
    { id: 7, name: "Tomate", siembra: "2025-04-05", estado: "Semilla", hectareas: 4 },
    { id: 8, name: "Papa", siembra: "2025-01-28", estado: "Creciendo", hectareas: 9 },
    { id: 9, name: "Maíz", siembra: "2025-03-20", estado: "Cosecha", hectareas: 11 },
    { id: 10, name: "Trigo", siembra: "2025-02-05", estado: "Cosecha", hectareas: 5 },
    { id: 11, name: "Tomate", siembra: "2025-04-10", estado: "Creciendo", hectareas: 7 },
    { id: 12, name: "Papa", siembra: "2025-01-15", estado: "Semilla", hectareas: 8 },
  ];

  const cropImages = {
    Maíz: "./crops/maiz.png",
    Trigo: "./crops/trigo.png",
    Tomate: "./crops/tomate.png",
    Papa: "./crops/papa.png",
    Default: "./crops/default.png",
  };

  const [crops, setCrops] = useState(
    initialCrops.map(c => ({ ...c, img: cropImages[c.name] || cropImages.Default }))
  );
  const [hovered, setHovered] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCrop, setFilterCrop] = useState(null);
  const [filterEstado, setFilterEstado] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCrop, setEditingCrop] = useState(null);
  const [form] = Form.useForm();

  // Aplicar búsqueda y filtros
  const filteredCrops = crops.filter(crop => {
    return (
      crop.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!filterCrop || crop.name === filterCrop) &&
      (!filterEstado || crop.estado === filterEstado)
    );
  });

  const showModal = (crop = null) => {
    if (crop) {
      setEditingCrop(crop);
      form.setFieldsValue({
        name: crop.name,
        siembra: crop.siembra,
        estado: crop.estado,
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

  const handleAddOrEditCrop = (values) => {
    const image = cropImages[values.name] || cropImages.Default;
    if (editingCrop) {
      setCrops(
        crops.map(c =>
          c.id === editingCrop.id ? { ...c, ...values, img: image } : c
        )
      );
    } else {
      const newCrop = {
        id: crops.length + 1,
        ...values,
        img: image,
      };
      setCrops([newCrop, ...crops]);
    }
    handleCancel();
  };

  const handleDeleteCrop = (id) => {
    setCrops(crops.filter(crop => crop.id !== id));
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <Input
          placeholder="Buscar cultivo por nombre"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "300px" }}
          prefix={<SearchOutlined />}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
          Agregar Cultivo
        </Button>
        <Select
          placeholder="Filtrar por cultivo"
          style={{ width: "150px" }}
          allowClear
          onChange={(value) => setFilterCrop(value)}
        >
          {cropOptions.map(option => (
            <Select.Option key={option} value={option}>{option}</Select.Option>
          ))}
        </Select>
        <Select
          placeholder="Filtrar por estado"
          style={{ width: "150px" }}
          allowClear
          onChange={(value) => setFilterEstado(value)}
        >
          {estadoOptions.map(option => (
            <Select.Option key={option} value={option}>{option}</Select.Option>
          ))}
        </Select>
      </div>

      <Row gutter={[16, 16]}>
        {filteredCrops.map((crop) => (
          <Col key={crop.id} xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              onMouseEnter={() => setHovered(crop.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                backgroundColor: hovered === crop.id ? "#e6f7ff" : "white",
                transition: "0.3s",
                position: "relative",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
                <img
                  alt={crop.name}
                  src={crop.img}
                  style={{
                    width: "60px",
                    height: "60px",
                    objectFit: "contain",
                    marginRight: "10px",
                  }}
                />
                <div>
                  <h3 style={{ margin: 0 }}>{crop.name}</h3>
                  <p style={{ margin: 0, color: "#666" }}>Estado: {crop.estado}</p>
                  <p style={{ margin: 0, color: "#666" }}>Siembra: {crop.siembra}</p>
                  <p style={{ margin: 0, color: "#666" }}>Hectáreas: {crop.hectareas}</p>
                </div>
              </div>
              <div style={{ position: "absolute", top: "10px", right: "10px", display: "flex", gap: "5px" }}>
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  size="small"
                  onClick={() => handleDeleteCrop(crop.id)}
                />
                <Button
                  type="default"
                  icon={<EditOutlined />}
                  size="small"
                  onClick={() => showModal(crop)}
                />
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal title={editingCrop ? "Modificar Cultivo" : "Agregar Cultivo"} open={isModalOpen} onCancel={handleCancel} footer={null}>
        <Form form={form} layout="vertical" onFinish={handleAddOrEditCrop}>
          <Form.Item
            label="Nombre"
            name="name"
            rules={[{ required: true, message: "Por favor selecciona el cultivo" }]}
          >
            <Select placeholder="Selecciona cultivo">
              {cropOptions.map(option => (
                <Select.Option key={option} value={option}>{option}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Estado"
            name="estado"
            rules={[{ required: true, message: "Selecciona el estado" }]}
          >
            <Select placeholder="Selecciona estado">
              {estadoOptions.map(option => (
                <Select.Option key={option} value={option}>{option}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Fecha de siembra"
            name="siembra"
            rules={[{ required: true, message: "Ingresa la fecha de siembra" }]}
          >
            <Input type="date" />
          </Form.Item>

          <Form.Item
            label="Hectáreas"
            name="hectareas"
            rules={[{ required: true, message: "Ingresa la cantidad en hectáreas" }]}
          >
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
