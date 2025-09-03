//export default function Animals(){ return <h2>Animales</h2>; }
import { Card, Row, Col, Input, Button, Modal, Form, Select } from "antd";
import { SearchOutlined, PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useState } from "react";

export default function Animals() {
  const initialAnimals = [
    { id: 1, name: "Ana", type: "Vaca", nacimiento: "2020-06-15" },
    { id: 2, name: "Beatriz", type: "Vaca", nacimiento: "2021-04-10" },
    { id: 3, name: "Carla", type: "Gallina", nacimiento: "2022-01-20" },
    { id: 4, name: "Diana", type: "Gallina", nacimiento: "2022-03-15" },
    { id: 5, name: "Elena", type: "Cerdo", nacimiento: "2021-09-05" },
    { id: 6, name: "Fernanda", type: "Cerdo", nacimiento: "2021-11-12" },
    { id: 7, name: "Gabriela", type: "Vaca", nacimiento: "2020-08-22" },
    { id: 8, name: "Helena", type: "Gallina", nacimiento: "2022-05-18" },
    { id: 9, name: "Isabel", type: "Cerdo", nacimiento: "2021-12-01" },
    { id: 10, name: "Juliana", type: "Vaca", nacimiento: "2020-10-30" },
    { id: 11, name: "Karla", type: "Gallina", nacimiento: "2022-07-09" },
    { id: 12, name: "Laura", type: "Cerdo", nacimiento: "2022-02-14" },
  ];

  const animalImages = {
    Vaca: "./animals/vaca.png",
    Gallina: "./animals/gallina.png",
    Cerdo: "./animals/cerdo.png",
  };

  const [animals, setAnimals] = useState(
    initialAnimals.map(a => ({ ...a, img: animalImages[a.type] }))
  );
  const [hovered, setHovered] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState(null);
  const [filterAge, setFilterAge] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState(null);
  const [form] = Form.useForm();

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const maxAge = Math.max(...animals.map(a => calculateAge(a.nacimiento)));

  const ageRanges = [
    { label: "<1 año", min: 0, max: 0 },
    { label: "1-2 años", min: 1, max: 2 },
    { label: "2-3 años", min: 2, max: 3 },
    ...(maxAge > 3 ? [{ label: ">3 años", min: 4, max: maxAge }] : [])
  ];

  const filteredAnimals = animals.filter(animal => {
    const age = calculateAge(animal.nacimiento);
    const ageMatch = filterAge ? age >= filterAge.min && age <= filterAge.max : true;
    const typeMatch = filterType ? animal.type === filterType : true;
    const nameMatch = animal.name.toLowerCase().includes(searchTerm.toLowerCase());
    return ageMatch && typeMatch && nameMatch;
  });

  const showModal = (animal = null) => {
    if (animal) {
      setEditingAnimal(animal);
      form.setFieldsValue({
        name: animal.name,
        type: animal.type,
        nacimiento: animal.nacimiento,
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

  const handleAddOrEditAnimal = (values) => {
    if (editingAnimal) {
      setAnimals(
        animals.map(a =>
          a.id === editingAnimal.id
            ? { ...a, name: values.name, type: values.type, nacimiento: values.nacimiento, img: animalImages[values.type] }
            : a
        )
      );
    } else {
      const newAnimal = {
        id: animals.length + 1,
        name: values.name,
        type: values.type,
        nacimiento: values.nacimiento,
        img: animalImages[values.type],
      };
      setAnimals([newAnimal, ...animals]);
    }
    handleCancel();
  };

  const handleDeleteAnimal = (id) => {
    setAnimals(animals.filter(animal => animal.id !== id));
  };

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
          onChange={value => setFilterType(value)}
        >
          {Object.keys(animalImages).map(type => (
            <Select.Option key={type} value={type}>{type}</Select.Option>
          ))}
        </Select>
        <Select
          placeholder="Filtrar por edad"
          style={{ width: "150px" }}
          allowClear
          onChange={value => setFilterAge(ageRanges.find(r => r.label === value))}
        >
          {ageRanges.map(range => (
            <Select.Option key={range.label} value={range.label}>{range.label}</Select.Option>
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
              onMouseEnter={() => setHovered(animal.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                backgroundColor: hovered === animal.id ? "#e6f7ff" : "white",
                transform: hovered === animal.id ? "scale(1.05)" : "scale(1)",
                transition: "all 0.3s ease",
                position: "relative",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
                <img
                  alt={animal.name}
                  src={animal.img}
                  style={{
                    width: "60px",
                    height: "60px",
                    objectFit: "contain",
                    marginRight: "10px",
                  }}
                />
                <div>
                  <h3 style={{ margin: 0 }}>{animal.name}</h3>
                  <p style={{ margin: 0, color: "#666" }}>{animal.type}</p>
                  <p style={{ margin: 0, color: "#666" }}>
                    Edad: {calculateAge(animal.nacimiento)} años
                  </p>
                </div>
              </div>
              <div style={{ position: "absolute", top: "10px", right: "10px", display: "flex", gap: "5px" }}>
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  size="small"
                  onClick={() => handleDeleteAnimal(animal.id)}
                />
                <Button
                  type="default"
                  icon={<EditOutlined />}
                  size="small"
                  onClick={() => showModal(animal)}
                />
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal */}
      <Modal title={editingAnimal ? "Modificar Animal" : "Agregar Animal"} open={isModalOpen} onCancel={handleCancel} footer={null}>
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
              {Object.keys(animalImages).map(type => (
                <Select.Option key={type} value={type}>{type}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Fecha de nacimiento"
            name="nacimiento"
            rules={[{ required: true, message: "Por favor ingresa la fecha" }]}
          >
            <Input type="date" />
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
