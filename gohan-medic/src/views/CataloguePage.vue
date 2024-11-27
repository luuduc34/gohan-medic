<template>
  <h1 class="catalogue-title">Catalogue</h1>
  <div class="catalogue">
    <MedicamentCard
      v-for="medicament in medicaments"
      :key="medicament.id"
      :medicament="medicament"
    />
  </div>
</template>

<script>
import MedicamentCard from "@/components/Medicament/MedicamentCard.vue"
import * as MedicamentService from '../services/MedicamentService';

export default {
  name: "CataloguePage",
  components: {
    MedicamentCard,
  },
  data() {
    return {
      medicaments: [],
    };
  },
  async created() {
    this.medicaments = await MedicamentService.fetchMedicaments(); // Récupérer les médicaments depuis Supabase
  },
};
</script>

<style scoped>
/* Titre du catalogue */
.catalogue-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: bold;
  color: #2d9cdb; /* Bleu pharmaceutique */
  margin-bottom: 30px;
  padding: 15px;
  background-color: #e3f2fd; /* Bleu clair doux */
  border-radius: 10px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Styles pour le catalogue */
.catalogue {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 25px;
  padding: 30px;
}

/* Réduction de la taille des cartes */
.product-card {
  width: 270px; /* Carte plus étroite */
  height: 380px; /* Hauteur plus ajustée */
  margin: 0 auto;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s ease;
  border: 1px solid #ddd;
}

.product-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

/* Style de l'image */
.product-card img {
  width: 100%;
  height: 220px;
  object-fit: cover;
  border-bottom: 1px solid #ddd;
  transition: opacity 0.3s;
}

.product-card img:hover {
  opacity: 0.8;
}

/* Informations produit */
.product-info {
  padding: 15px;
  text-align: center;
}

.product-info h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.product-info span {
  font-size: 1.1rem;
  font-weight: 500;
  color: #2d9cdb; /* Bleu clair */
}

/* Description produit au survol */
.product-description {
  padding: 10px;
  font-size: 14px;
  color: #555;
  text-align: justify;
  background-color: #fafafa;
  border-top: 1px solid #ddd;
  border-radius: 0 0 12px 12px;
}

/* Responsivité */
@media (max-width: 1024px) {
  .catalogue {
    grid-template-columns: repeat(3, 1fr);
  }

  .product-card {
    width: 250px;
  }
}

@media (max-width: 768px) {
  .catalogue {
    grid-template-columns: repeat(2, 1fr);
  }

  .product-card {
    width: 220px;
  }
}

@media (max-width: 480px) {
  .catalogue {
    grid-template-columns: 1fr;
  }

  .product-card {
    width: 100%;
  }
}
</style>