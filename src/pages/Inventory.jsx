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

  // 🔹 PAGINACIÓN ESTILO ANIMALS
  const limit = 12;
  const [historyKeys, setHistoryKeys] = useState([null]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastKey, setLastKey] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  // 🔹 CARGAR INVENTARIO
  const fetchInventoryPage = async (direction = "current") => {
    let keyToLoad = null;

    if (direction === "next") {
      if (!lastKey) return;
      keyToLoad = lastKey;
    } else if (direction === "prev") {
      if (currentIndex === 0) return;
      keyToLoad = historyKeys[currentIndex - 1];
    }

    try {
      const data = await getInventory(limit, keyToLoad);
      if (!data) return;

      setItems(data.items || []);
      setLastKey(data.lastKey || null);

      // Actualizar historial e índice
      if (direction === "next") {
        const newHistory = [...historyKeys.slice(0, currentIndex + 1), keyToLoad];
        setHistoryKeys(newHistory);
        setCurrentIndex(prev => prev + 1);
      } else if (direction === "prev") {
        setCurrentIndex(prev => prev - 1);
      } else {
        setHistoryKeys([null]);
        setCurrentIndex(0);
      }

      // totalPages según totalCount si existe
      if (data.totalCount != null) {
        setTotalPages(Math.ceil(data.totalCount / limit));
      } else {
        setTotalPages(historyKeys.length + (data.lastKey ? 1 : 1));
      }

    } catch (err) {
      console.error("fetchInventoryPage:", err);
      message.error("Error al cargar inventario");
    }
  };

  useEffect(() => {
    fetchInventoryPage();
  }, []);

  // 🔹 FILTROS
  const filteredItems = items.filter(
    item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterCategory ? item.category === filterCategory : true)
  );

  // 🔹 MODAL
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
    try {
      if (editingItem) {
        await updateInventory({ id: editingItem.id, ...values });
        message.success("Producto modificado correctamente");
      } else {
        await addInventory(values);
        message.success("Producto agregado correctamente");
      }
      fetchInventoryPage("current");
      handleCancel();
    } catch (err) {
      console.error(err);
      message.error("Error al guardar producto");
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await deleteInventory(id);
      message.success("Producto eliminado correctamente");
      fetchInventoryPage("current");
    } catch (err) {
      console.error(err);
      message.error("Error al eliminar producto");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Barra de búsqueda y filtros */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <Input
          placeholder="Buscar producto"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ width: "250px" }}
          prefix={<SearchOutlined />}
        />
        <Select
          placeholder="Filtrar por categoría"
          style={{ width: "180px" }}
          allowClear
          onChange={setFilterCategory}
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
              style={{ position: "relative", transition: "all 0.3s ease" }}
            >
              <h3>{item.name}</h3>
              <p>Categoría: {item.category}</p>
              <p>Cantidad: {item.quantity} {item.unit}</p>
              <p>Fecha de ingreso: {item.date}</p>
              <div style={{ position: "absolute", top: 10, right: 10, display: "flex", gap: 5 }}>
                <Button type="primary" danger size="small" icon={<DeleteOutlined />} onClick={() => handleDeleteItem(item.id)} />
                <Button type="default" size="small" icon={<EditOutlined />} onClick={() => showModal(item)} />
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Paginación */}
      <div style={{ marginTop: 20, display: "flex", justifyContent: "center", gap: 10, alignItems: "center" }}>
        <Button disabled={currentIndex === 0} onClick={() => fetchInventoryPage("prev")}>
          Anterior
        </Button>
        <span>Página {currentIndex + 1} </span>
        <Button disabled={!lastKey} onClick={() => fetchInventoryPage("next")}>
          Siguiente
        </Button>
      </div>

      {/* Modal */}
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
