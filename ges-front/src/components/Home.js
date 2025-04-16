import React from "react";
import { Link } from "react-router-dom";
import imgPresentation from "../assets/images/img-presentation.png";
import config from "../config/config";




const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="hero bg-gray-100 py-16 flex-grow">
        <div className="container mx-auto flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2">
            <h1 className="text-4xl font-bold mb-4">
              Application de Gestion d'établissement scolaire
              <span className="block text-purple-500">pour une meilleure gestion des écoles</span>
            </h1>
            <p className="text-lg mb-6">
              Gérer les élèves, les enseignements et les enseignants.
            </p>
            <div>
              <Link
                to="/LoginAll"
                className="bg-purple-700 text-white px-4 py-2 rounded-md hover:bg-purple-400"
              >
                Se Connecter
              </Link>
              <a
                href="#Fonctionnalités"
                className="border border-purple-500 text-purple-500 px-4 py-2 rounded-md hover:bg-purple-500 hover:text-white ml-4"
              >
                En savoir plus
              </a>
            </div>
          </div>
          <div className="lg:w-1/2 mt-10 lg:mt-0">
            <img
              src={imgPresentation}
              alt="Image de présentation"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>

      {/* Fonctionnalités Section */}
      <div id="Fonctionnalités" className="services bg-white py-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Principales <em className="text-purple-500">Fonctionnalités</em> de <em>SISOKO</em>
          </h2>
          <p className="text-center mb-12">
            Explorez une multitude de fonctionnalités avancées avec notre application de gestion d'établissement.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="service-item text-center p-6 bg-gray-100 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">Gestion des Élèves</h3>
              <p>
                SISOKO permet une gestion efficace des données des élèves, y compris les inscriptions, les transferts et les résultats académiques.
              </p>
            </div>
            <div className="service-item text-center p-6 bg-gray-100 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">Suivi des Enseignants</h3>
              <p>
                Les professeurs peuvent saisir les notes, suivre les présences et communiquer avec les parents.
              </p>
            </div>
            <div className="service-item text-center p-6 bg-gray-100 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">Administration Scolaire</h3>
              <p>
                Gérez les emplois du temps, les ressources humaines et la scolarite.
              </p>
            </div>
            <div className="service-item text-center p-6 bg-gray-100 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">Portail Étudiant</h3>
              <p>
                Accédez à un portail personnalisé pour consulter les notes, l'emploi du temps et les bulletins au fur et à mesure.
              </p>
            </div>
            <div className="service-item text-center p-6 bg-gray-100 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">Sécurité et Confidentialité</h3>
              <p>
                SISOKO garantit la sécurité des données avec des normes de confidentialité rigoureuses.
              </p>
            </div>
            <div className="service-item text-center p-6 bg-gray-100 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">Tableau de Bord Personnalisé</h3>
              <p>
                l'administrateur a un rapport sur les presences de chaque eleve et chaque classe.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Avantages Section */}
      <div id="Avantages" className="about-us bg-gray-50 py-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Pourquoi <em className="text-purple-500">avoir SISOKO</em> dans votre établissement ?
          </h2>
          <p className="text-center mb-12">
            Découvrez les avantages exceptionnels de notre application de gestion scolaire.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="box-item p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">Efficacité Administrative</h3>
              <p>
                Simplifiez les tâches administratives avec des processus automatisés.
              </p>
            </div>
            <div className="box-item p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">Communication Transparente</h3>
              <p>
                Favorisez une communication ouverte et en temps réel entre les acteurs.
              </p>
            </div>
            <div className="box-item p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">Optimisation de l'Expérience Éducative</h3>
              <p>
                Offrez une meilleure expérience grâce à un accès facile aux ressources pédagogiques.
              </p>
            </div>
            <div className="box-item p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">Accessibilité Universelle</h3>
              <p>
                Accédez à la plateforme à tout moment depuis n'importe où.
              </p>
            </div>
            <div className="box-item p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">Sécurité et Confidentialité</h3>
              <p>
                Assurez la protection des données avec des mesures robustes.
              </p>
            </div>
            <div className="box-item p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">Efficacité Financière</h3>
              <p>
                Suivez la scolarite de chaque eleve afin de connaitre les insolvables
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-purple-700 text-white py-4">
        <div className="container text-center">
          <p>© 2025 Gestionnaire d'établissement scolaire. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
