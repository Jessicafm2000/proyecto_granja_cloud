// src/pages/Crops.jsx
import { Card, Row, Col, Input, Button, Modal, Form, Select, message } from "antd";
import { SearchOutlined, PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { getCrops, addCrop, updateCrop, deleteCrop } from "../api";

const cropImages = {
  Maíz: "https://d2trfafuwnq9hu.cloudfront.net/crops/maiz.png",
  Trigo: "https://d2trfafuwnq9hu.cloudfront.net/crops/trigo.png",
  Tomate: "https://d2trfafuwnq9hu.cloudfront.net/crops/tomate.png",
  Papa: "https://d2trfafuwnq9hu.cloudfront.net/crops/papa.png",
  Ajo: "https://d2trfafuwnq9hu.cloudfront.net/crops/ajo.png",
  Coliflor: "https://d2trfafuwnq9hu.cloudfront.net/crops/coliflor.png",
  Fresa: "https://d2trfafuwnq9hu.cloudfront.net/crops/fresa.png",
  Remolacha: "https://d2trfafuwnq9hu.cloudfront.net/crops/remolacha.png",
  Repollo: "https://d2trfafuwnq9hu.cloudfront.net/crops/repollo.png",
  Zanahoria: "https://d2trfafuwnq9hu.cloudfront.net/crops/zanahoria.png",
  Default: "./crops/default.png",
};

export default function Crops() {
  const cropOptions = ["Maíz", "Trigo", "Tomate", "Papa", "Ajo", "Coliflor", "Fresa", "Remolacha", "Repollo", "Zanahoria"];
  const estadoOptions = ["Semilla", "Creciendo", "Cosecha"];
  const limit = 12; // cultivos por página

  const [crops, setCrops] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCrop, setFilterCrop] = useState(null);
  const [filterEstado, setFilterEstado] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCrop, setEditingCrop] = useState(null);
  const [form] = Form.useForm();

  // --- PAGINACIÓN ---
  const [historyKeys, setHistoryKeys] = useState([null]); // historial de lastKeys
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastKey, setLastKey] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  const loadCrops = async (direction = "current") => {
    let keyToLoad = null;

    if (direction === "next") {
      if (!lastKey) return;
      keyToLoad = lastKey;
    } else if (direction === "prev") {
      if (currentIndex === 0) return;
      keyToLoad = historyKeys[currentIndex - 1];
    } else {
      keyToLoad = null;
    }

    try {
      const data = await getCrops(limit, keyToLoad);
      if (!data) return;

      const formatted = data.items.map((c) => ({
        id: c.id,
        name: c.name,
        estado: c.estado,
        siembra: c.siembra,
        hectareas: c.hectareas,
        img: cropImages[c.name] || cropImages.Default,
      }));

      setCrops(formatted);
      setLastKey(data.lastKey || null);

      // Actualizar historial e índice correctamente
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

      // actualizar totalPages
      if (data.totalCount) {
        setTotalPages(Math.ceil(data.totalCount / limit));
      } else {
        setTotalPages(historyKeys.length + (data.lastKey ? 1 : 0));
      }
    } catch (error) {
      console.error("Error cargando cultivos:", error);
      message.error("Error cargando cultivos");
    }
  };

  useEffect(() => {
    loadCrops();
  }, []);

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

  const handleAddOrEditCrop = async (values) => {
    try {
      if (editingCrop) {
        await updateCrop({ id: editingCrop.id, ...values });
        message.success("Cultivo modificado correctamente");
      } else {
        await addCrop(values);
        message.success("Cultivo agregado correctamente");
      }

      await loadCrops("current");
      handleCancel();
    } catch (error) {
      console.error("Error al agregar/editar cultivo:", error);
      message.error("Error al agregar/editar cultivo");
    }
  };

  const handleDeleteCrop = async (id) => {
    try {
      await deleteCrop(id);
      setCrops((prev) => prev.filter((c) => c.id !== id));
      message.success("Cultivo eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar cultivo:", error);
      message.error("Error al eliminar cultivo");
    }
  };

  const filteredCrops = crops.filter(
    (c) =>
      c.name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!filterCrop || c.name === filterCrop) &&
      (!filterEstado || c.estado === filterEstado)
  );

  return (
    <div style={{ padding: "20px" }}>
      {/* Filtros */}
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

      {/* Botones de paginación */}
      <div style={{ textAlign: "center", marginTop: 20, display: "flex", justifyContent: "center", gap: "10px", alignItems: "center" }}>
        <Button disabled={currentIndex === 0} onClick={() => loadCrops("prev")}>
          Anterior
        </Button>

        <span>Página {currentIndex + 1}</span>

        <Button disabled={!lastKey} onClick={() => loadCrops("next")}>
          Siguiente
        </Button>
      </div>

      {/* Modal */}
      <Modal title={editingCrop ? "Modificar Cultivo" : "Agregar Cultivo"} open={isModalOpen} onCancel={handleCancel} footer={null}>
        <Form form={form} layout="vertical" onFinish={handleAddOrEditCrop}>
          <Form.Item label="Nombre" name="name" rules={[{ required: true, message: "Selecciona el cultivo" }]}>
            <Select placeholder="Selecciona cultivo">
              {cropOptions.map((option) => (
                <Select.Option key={option} value={option}>
                  {option}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Estado" name="estado" rules={[{ required: true, message: "Selecciona el estado" }]}>
            <Select placeholder="Selecciona estado">
              {estadoOptions.map((option) => (
                <Select.Option key={option} value={option}>
                  {option}
                </Select.Option>
              ))}
            </Select>
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
