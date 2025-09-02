//export default function Inventory(){ return <h2>Inventario</h2>; }
import { Card, Row, Col, Input, Button, Modal, Form, Select, InputNumber } from "antd";
import { SearchOutlined, PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useState } from "react";

export default function Inventory() {
  const initialItems = [
    { id: 1, name: "Alimento Vaca", quantity: 50, unit: "kg", category: "Alimento", date: "2025-08-01" },
    { id: 2, name: "Abono Orgánico", quantity: 20, unit: "bolsa", category: "Fertilizante", date: "2025-08-05" },
    { id: 3, name: "Antibiótico Cerdo", quantity: 10, unit: "litros", category: "Medicamento", date: "2025-07-28" },
    { id: 4, name: "Fungicida Tomate", quantity: 5, unit: "litros", category: "Fertilizante", date: "2025-08-02" },
  ];

  const [items, setItems] = useState(initialItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterCategory ? item.category === filterCategory : true)
  );

  const showModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      form.setFieldsValue(item);
    } else {
      setEditingItem(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    form.resetFields();
  };

  const handleAddOrEditItem = (values) => {
    if (editingItem) {
      setItems(items.map(i => i.id === editingItem.id ? { ...values, id: i.id } : i));
    } else {
      const newItem = { id: items.length + 1, ...values };
      setItems([newItem, ...items]);
    }
    handleCancel();
  };

  const handleDeleteItem = (id) => {
    setItems(items.filter(i => i.id !== id));
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <Input
          placeholder="Buscar producto"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "250px" }}
          prefix={<SearchOutlined />}
        />
        <Select
          placeholder="Filtrar por categoría"
          style={{ width: "180px" }}
          allowClear
          onChange={value => setFilterCategory(value)}
        >
          <Select.Option value="Alimento">Alimento</Select.Option>
          <Select.Option value="Medicamento">Medicamento</Select.Option>
          <Select.Option value="Fertilizante">Fertilizante</Select.Option>
          <Select.Option value="Otro">Otro</Select.Option>
        </Select>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
          Agregar Producto
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        {filteredItems.map(item => (
          <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              style={{ position: "relative" }}
            >
              <h3>{item.name}</h3>
              <p>Categoría: {item.category}</p>
              <p>Cantidad: {item.quantity} {item.unit}</p>
              <p>Fecha de ingreso: {item.date}</p>
              <div style={{ position: "absolute", top: "10px", right: "10px", display: "flex", gap: "5px" }}>
                <Button type="primary" danger icon={<DeleteOutlined />} size="small" onClick={() => handleDeleteItem(item.id)} />
                <Button type="default" icon={<EditOutlined />} size="small" onClick={() => showModal(item)} />
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal title={editingItem ? "Modificar Producto" : "Agregar Producto"} open={isModalOpen} onCancel={handleCancel} footer={null}>
        <Form form={form} layout="vertical" onFinish={handleAddOrEditItem}>
          <Form.Item label="Nombre" name="name" rules={[{ required: true, message: "Ingresa el nombre" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Cantidad" name="quantity" rules={[{ required: true, message: "Ingresa la cantidad" }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Unidad" name="unit" rules={[{ required: true, message: "Selecciona la unidad" }]}>
            <Select>
              <Select.Option value="kg">kg</Select.Option>
              <Select.Option value="litros">litros</Select.Option>
              <Select.Option value="unidades">unidades</Select.Option>
              <Select.Option value="bolsa">bolsa</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Categoría" name="category" rules={[{ required: true, message: "Selecciona la categoría" }]}>
            <Select>
              <Select.Option value="Alimento">Alimento</Select.Option>
              <Select.Option value="Medicamento">Medicamento</Select.Option>
              <Select.Option value="Fertilizante">Fertilizante</Select.Option>
              <Select.Option value="Otro">Otro</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Fecha de ingreso" name="date" rules={[{ required: true, message: "Selecciona la fecha" }]}>
            <Input type="date" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              {editingItem ? "Modificar" : "Agregar"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
