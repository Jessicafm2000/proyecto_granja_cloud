import { Card, Row, Col, Statistic } from "antd";
import { Dog, Egg, Syringe, Package } from "lucide-react";
import { useState, useEffect } from "react";
import { getAnimals, getProduction, getVaccines, getCrops, getInventory } from "../api";

export default function Home() {
  const [selectedCard, setSelectedCard] = useState(null);

  // Estados de estadísticas
  const [totalAnimales, setTotalAnimales] = useState(0);
  const [totalLeche, setTotalLeche] = useState(0);
  const [totalHuevos, setTotalHuevos] = useState(0);
  const [pigsSold, setPigsSold] = useState(0);
  const [vacunasPendientes, setVacunasPendientes] = useState(0);
  const [vacunasAplicadas, setVacunasAplicadas] = useState(0);
  const [totalCultivos, setTotalCultivos] = useState(0);
  const [inventarioDisponible, setInventarioDisponible] = useState("0%");

  useEffect(() => {
    async function fetchData() {
      try {
        // Animales
        const animalsRes = await getAnimals(); // obtiene paginación por defecto
        setTotalAnimales(animalsRes?.totalCount || 0);

        // Producción
        const productionRes = await getProduction();
        const production = productionRes?.items || [];
        setTotalLeche(production.reduce((sum, p) => sum + Number(p.milk || 0), 0));
        setTotalHuevos(production.reduce((sum, p) => sum + Number(p.eggs || 0), 0));
        setPigsSold(production.reduce((sum, p) => sum + Number(p.pigsSold || 0), 0));

        // Vacunas
        const vaccinesRes = await getVaccines();
        const vaccines = vaccinesRes?.items || [];
        setVacunasPendientes(vaccines.filter(v => v.status?.toLowerCase() === "pendiente").length);
        setVacunasAplicadas(vaccines.filter(v => v.status?.toLowerCase() === "aplicada").length);

        // Cultivos
        const cropsRes = await getCrops();
        setTotalCultivos(cropsRes?.totalCount || 0);

        // Inventario
        const inventoryRes = await getInventory();
        const inventory = inventoryRes?.items || [];
        if (inventory.length) {
          const disponibles = inventory.filter(i => Number(i.quantity) > 0).length;
          const porcentaje = Math.round((disponibles / inventory.length) * 100);
          setInventarioDisponible(`${porcentaje}%`);
        }

      } catch (error) {
        console.error("Error cargando dashboard:", error);
      }
    }

    fetchData();
  }, []);

  // Configuración de tarjetas
  const cards = [
    { key: "animales", title: "Total Animales", value: totalAnimales, icon: <Dog size={20} style={{ marginRight: 8 }} /> },
    { key: "leche", title: "Leche Hoy (L)", value: totalLeche, icon: <Dog size={20} style={{ marginRight: 8 }} /> },
    { key: "huevos", title: "Huevos Hoy", value: totalHuevos, icon: <Egg size={20} style={{ marginRight: 8 }} /> },
    { key: "cerdos", title: "Cerdos Vendidos Hoy", value: pigsSold, icon: <Dog size={20} style={{ marginRight: 8 }} /> },
    { key: "vacunasPendientes", title: "Vacunas Pendientes", value: vacunasPendientes, icon: <Syringe size={20} style={{ marginRight: 8 }} /> },
    { key: "vacunasAplicadas", title: "Vacunas Aplicadas", value: vacunasAplicadas, icon: <Syringe size={20} style={{ marginRight: 8 }} /> },
    { key: "cultivos", title: "Total Cultivos", value: totalCultivos, icon: <Package size={20} style={{ marginRight: 8 }} /> },
    { key: "inventario", title: "Inventario Disponible", value: inventarioDisponible, icon: <Package size={20} style={{ marginRight: 8 }} /> },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 24 }}>🐮🐔🐷 Estadísticas de la Granja</h1>

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
                transition: "all 0.3s ease",
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
