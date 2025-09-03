//export default function Home(){ return <h2>Home</h2>; }
import { Card, Row, Col, Statistic } from "antd";
import { Dog, Egg, Syringe, Package } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [selectedCard, setSelectedCard] = useState(null);

  // Datos de ejemplo
  const totalAnimales = 65;
  const totalLeche = 120;
  const totalHuevos = 200;
  const ventasHoy = 350;
  const vacunasPendientes = 3;
  const inventarioDisponible = "80%";

  // Configuración de tarjetas
  const cards = [
    {
      key: "animales",
      title: "Total Animales",
      value: totalAnimales,
      icon: <Dog size={20} style={{ marginRight: 8 }} />,
    },
    {
      key: "leche",
      title: "Leche Hoy (L)",
      value: totalLeche,
      icon: <Dog size={20} style={{ marginRight: 8 }} />,
    },
    {
      key: "huevos",
      title: "Huevos Hoy",
      value: totalHuevos,
      icon: <Egg size={20} style={{ marginRight: 8 }} />,
    },
    {
      key: "ventas",
      title: "Ventas Hoy",
      value: ventasHoy,
      icon: "$",
    },
    {
      key: "vacunas",
      title: "Vacunas Pendientes",
      value: vacunasPendientes,
      icon: <Syringe size={20} style={{ marginRight: 8 }} />,
    },
    {
      key: "inventario",
      title: "Inventario Disponible",
      value: inventarioDisponible,
      icon: <Package size={20} style={{ marginRight: 8 }} />,
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 24 }}>🐮🐔🐷 Dashboard Granja</h1>

      <Row gutter={[16, 16]}>
        {cards.map((c) => (
          <Col key={c.key} xs={24} sm={12} md={6}>
            <Card
              hoverable
              bordered
              onClick={() => setSelectedCard(c.key)}
              style={{
                cursor: "pointer",
                backgroundColor: selectedCard === c.key ? "#e6f7ff" : "white",
                border:
                  selectedCard === c.key
                    ? "2px solid #1890ff"
                    : "1px solid #f0f0f0",
                transition: "all 0.3s ease", // animación suave
              }}
              bodyStyle={{ transition: "all 0.3s ease" }}
              className="card-custom"
            >
              <Statistic title={c.title} value={c.value} prefix={c.icon} />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Estilos adicionales */}
      <style jsx>{`
        .card-custom:hover {
          transform: scale(1.05);
          background-color: #f0f9ff !important;
          border-color: #40a9ff !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </div>
  );
}
