// src/pages/Animals.jsx
import { Card, Row, Col, Input, Button, Modal, Form, Select, message } from "antd";
import { SearchOutlined, PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { getAnimals, addAnimal, updateAnimal, deleteAnimal } from "../api";

const generateTempId = () => "_" + Math.random().toString(36).substr(2, 9);

export default function Animals() {
  const animalImages = {
    Vaca: "./animals/vaca.png",
    Gallina: "./animals/gallina.png",
    Cerdo: "./animals/cerdo.png",
  };

  const [animals, setAnimals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState(null);
  const [form] = Form.useForm();

  const loadAnimals = async () => {
    try {
      const data = await getAnimals();
      const formatted = data.map((a) => ({
        id: a.id ?? generateTempId(),
        name: a.nombre ?? a.name,
        type: a.tipo ?? a.type,
        edad: a.edad ?? a.age,
        img: animalImages[a.tipo ?? a.type] || "./animals/default.png",
      }));
      setAnimals(formatted);
    } catch (error) {
      console.error("Error cargando animales:", error);
      message.error("Error cargando animales");
    }
  };

  useEffect(() => {
    loadAnimals();
  }, []);

  const showModal = (animal = null) => {
    if (animal) {
      setEditingAnimal(animal);
      form.setFieldsValue({
        name: animal.name,
        type: animal.type,
        edad: animal.edad,
      });
    } else {
      setEditingAnimal(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingAnimal(null);
    form.resetFields();
  };

  const handleAddOrEditAnimal = async (values) => {
    try {
      let result;

      if (editingAnimal) {
        // Actualizar animal
        result = await updateAnimal({
          id: Number(editingAnimal.id),
          nombre: values.name,
          tipo: values.type,
          edad: Number(values.edad),
        });
      } else {
        // Agregar animal
        result = await addAnimal({
          nombre: values.name,
          tipo: values.type,
          edad: Number(values.edad),
        });
      }

      if (result?.message) message.success(result.message);
      await loadAnimals();
      handleCancel();
    } catch (error) {
      console.error("Error al agregar/editar animal:", error);
      message.error("Error al agregar/editar animal");
    }
  };

  const handleDeleteAnimal = async (id) => {
    try {
      const result = await deleteAnimal(id);
      if (result?.message) message.success(result.message);
      setAnimals((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      console.error("Error al eliminar animal:", error);
      message.error("Error al eliminar animal");
    }
  };

  const filteredAnimals = animals.filter((animal) => {
    const typeMatch = filterType ? animal.type === filterType : true;
    const nameMatch = animal.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return typeMatch && nameMatch;
  });

  return (
    <div style={{ padding: "20px" }}>
      {/* Filtros */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <Input
          placeholder="Buscar animal por nombre"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "250px" }}
          prefix={<SearchOutlined />}
        />
        <Select
          placeholder="Filtrar por tipo"
          style={{ width: "150px" }}
          allowClear
          onChange={(value) => setFilterType(value)}
        >
          {Object.keys(animalImages).map((type) => (
            <Select.Option key={type} value={type}>
              {type}
            </Select.Option>
          ))}
        </Select>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
          Agregar Animal
        </Button>
      </div>

      {/* Cards */}
      <Row gutter={[16, 16]}>
        {filteredAnimals.map((animal) => (
          <Col key={animal.id} xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              style={{ transition: "all 0.3s ease", position: "relative" }}
              extra={
                <>
                  <EditOutlined
                    style={{ marginRight: 8, cursor: "pointer" }}
                    onClick={() => showModal(animal)}
                  />
                  <DeleteOutlined
                    style={{ color: "red", cursor: "pointer" }}
                    onClick={() => handleDeleteAnimal(animal.id)}
                  />
                </>
              }
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  alt={animal.name}
                  src={animal.img}
                  style={{ width: 60, height: 60, objectFit: "contain", marginRight: 10 }}
                />
                <div>
                  <h3 style={{ margin: 0 }}>{animal.name}</h3>
                  <p style={{ margin: 0, color: "#666" }}>{animal.type}</p>
                  <p style={{ margin: 0, color: "#666" }}>Edad: {animal.edad} años</p>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal */}
      <Modal
        title={editingAnimal ? "Modificar Animal" : "Agregar Animal"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddOrEditAnimal}>
          <Form.Item
            label="Nombre"
            name="name"
            rules={[{ required: true, message: "Por favor ingresa el nombre" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Tipo"
            name="type"
            rules={[{ required: true, message: "Por favor selecciona el tipo" }]}
          >
            <Select placeholder="Selecciona un tipo">
              {Object.keys(animalImages).map((type) => (
                <Select.Option key={type} value={type}>
                  {type}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Edad"
            name="edad"
            rules={[{ required: true, message: "Por favor ingresa la edad" }]}
          >
            <Input type="number" min={0} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              {editingAnimal ? "Modificar" : "Agregar"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
