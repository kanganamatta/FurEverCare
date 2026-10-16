import { useEffect, useRef, useState } from "react";

function Stats() {

  const stats = [
    {
      target: 3400,
      suffix: "+",
      text: "Animals adopted"
    },
    {
      target: 1850,
      suffix: "+",
      text: "Rescues completed"
    },
    {
      target: 120,
      suffix: "",
      text: "Partner vets & shelters"
    },
    {
      target: 98,
      suffix: "%",
      text: "Adopters still in touch"
    }
  ];

  const [visible, setVisible] = useState(false);

  const sectionRef = useRef(null);

  useEffect(() => {

    const observer =
      new IntersectionObserver(
        ([entry]) => {

          if (entry.isIntersecting) {

            setVisible(true);

            observer.disconnect();
          }

        },
        {
          threshold: 0.5
        }
      );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };

  }, []);

  return (
    <section
      className="stats"
      ref={sectionRef}
    >

      <div className="stats-grid">

        {stats.map((stat) => (

          <Stat
            key={stat.text}
            {...stat}
            visible={visible}
          />

        ))}

      </div>

    </section>
  );
}


function Stat({
  target,
  suffix,
  text,
  visible
}) {

  const [count, setCount] = useState(0);

  useEffect(() => {

    if (!visible) return;

    const duration = 1400;
    const startTime = performance.now();

    const animate = (currentTime) => {

      const progress =
        Math.min(
          (currentTime - startTime) / duration,
          1
        );

      const eased =
        1 - Math.pow(1 - progress, 3);

      setCount(
        Math.floor(eased * target)
      );

      if (progress < 1) {
        requestAnimationFrame(animate);
      }

    };

    requestAnimationFrame(animate);

  }, [visible, target]);

  return (
    <div className="stat">

      <span className="stat-number">
        {count.toLocaleString()}
        {suffix}
      </span>

      <p>{text}</p>

    </div>
  );
}

export default Stats;