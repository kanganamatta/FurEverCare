import { featured } from "../pets";

function FeaturedPets({ onPetClick }) {

  return (
    <section className="section section-dark">

      <div className="section-head">

        <p className="kicker light">
          Featured this week
        </p>

        <h2 className="light">
          A few faces looking for their people
        </h2>

      </div>

      <div className="featured-track">

        {featured.map((pet) => (

          <div
            className="featured-card reveal"
            key={pet.id}
            onClick={() => onPetClick(pet)}
          >

            <div className="featured-img-wrap">
              <img
                src={pet.img}
                alt={pet.name}
                loading="lazy"
              />
              <button
                type="button"
                className="card-meet-me-slide-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onPetClick(pet);
                }}
                title={`Meet ${pet.name}`}
              >
                <span>Meet Me</span>
                <span>🐾</span>
              </button>
            </div>

            <div className="featured-card-body">

              <h3>{pet.name}</h3>

              <p>
                {pet.breed} · {pet.age}
              </p>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}

export default FeaturedPets;