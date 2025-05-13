import { Chart, PieController, ArcElement, Legend } from "chart.js";

Chart.register(PieController, ArcElement, Legend);

export function initCharts() {
  const architectPieChart = document.getElementById("architectPieChart");
  if (architectPieChart) {
    const ctx = architectPieChart.getContext("2d");
    const architectChart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["Residential", "Commercial", "Industrial", "Bank", "School"],
        datasets: [
          {
            label: "Architect",
            data: [12, 8, 5, 7, 7], // adjust to your real data
            backgroundColor: [
              "#336699",
              "#86BBD8",
              "#2F4858",
              "#9EE493",
              "#DAF7DC",
            ],
            borderColor: "#fff",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
          },
        },
      },
    });
  }
}
