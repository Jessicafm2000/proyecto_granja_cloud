import { Card, Row, Col, Input, Button, Modal, Form, Select, InputNumber, message } from "antd";
import { SearchOutlined, PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { getInventory, addInventory, updateInventory, deleteInventory } from "../api";

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form] = Form.useForm();

  // 🔹 Cargar inventario al inicio
  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    const data = await getInventory();
    setItems(data);
  };

  const filteredItems = items.filter(
    item =>
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

  const handleAddOrEditItem = async (values) => {
    if (editingItem) {
      // 🔹 Actualizar
      const res = await updateInventory({ id: editingItem.id, ...values });
      if (res) {
        setItems(items.map(i => (i.id === editingItem.id ? res : i)));
        message.success("Producto modificado correctamente");
      }
    } else {
      // 🔹 Agregar
      const res = await addInventory(values);
      if (res) {
        setItems([res, ...items]);
        message.success("Producto agregado correctamente");
      }
    }
    handleCancel();
  };

  const handleDeleteItem = async (id) => {
    const res = await deleteInventory(id);
    if (res) {
      setItems(items.filter(i => i.id !== id));
      message.success("Producto eliminado correctamente");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Barra de búsqueda y filtros */}
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

      {/* Cards de inventario */}
      <Row gutter={[16, 16]}>
        {filteredItems.map(item => (
          <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              className="inventory-card"
              style={{ position: "relative", transition: "all 0.3s ease" }}
            >
              <h3>{item.name}</h3>
              <p>Categoría: {item.category}</p>
              <p>Cantidad: {item.quantity} {item.unit}</p>
              <p>Fecha de ingreso: {item.date}</p>
              <div style={{ position: "absolute", top: "10px", right: "10px", display: "flex", gap: "5px" }}>
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  size="small"
                  onClick={() => handleDeleteItem(item.id)}
                />
                <Button
                  type="default"
                  icon={<EditOutlined />}
                  size="small"
                  onClick={() => showModal(item)}
                />
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal para agregar/editar */}
      <Modal
        title={editingItem ? "Modificar Producto" : "Agregar Producto"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
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

      {/* Estilos para hover */}
      <style jsx>{`
        .inventory-card:hover {
          transform: scale(1.05);
          background-color: #f0f9ff !important;
          border-color: #40a9ff !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </div>
  );
}
