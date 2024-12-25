import styles from "./Toggle.module.css";
import dayBackground from "../../assets/daybackground.jpeg";
import nightBackground from "../../assets/nightbackground.jpeg";

type toggleProps = {
  handleOnChange: () => void;
  toggleType: "theme" | "degree";
  isChecked: boolean;
};

//add css

const Toggle: React.FC<toggleProps> = ({
  handleOnChange,
  isChecked,
  toggleType,
}) => {
  return (
    <div className={`${styles.toggle}`}>
      <label className={`${styles.labelSlider} ${styles[toggleType]}`}>
        <input
          className={`${styles.inputSlider}`}
          type="checkbox"
          onChange={handleOnChange}
          checked={isChecked}
        />
        <span
          className={styles.slider}
          style={
            toggleType === "theme"
              ? {
                  backgroundImage: `url(${
                    isChecked ? nightBackground : dayBackground
                  })`
                }
              : {}
          }
        >
          {toggleType === "degree" && (isChecked ? "F" : "C")}
        </span>
      </label>
    </div>
  );
};

export default Toggle;
