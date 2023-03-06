import styles from "./Card.module.scss";

export type CardProps = {
  /** URL изображения */
  image: string;
  /** Заголовок карточки */
  title: React.ReactNode;
  /** Подзаголовок карточки */
  subtitle: React.ReactNode;
  /** Содержимое карточки (футер/боковая часть), может быть пустым */
  content?: React.ReactNode;
  /** Клик на карточку */
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  price: string;
  priceChange: string;
};

export const Card: React.FC<CardProps> = ({
  image,
  title,
  subtitle,
  content,
  onClick,
  price,
  priceChange,
  ...props
}) => {
  return (
    <div onClick={onClick} className={styles["card"]} {...props}>
      <img className={styles["card__img"]} src={image} alt="coin" />

      <div>
        <h3 className={styles["card__title"]}>{title}</h3>
        <h4 className={styles["card__subtitle"]}>{subtitle}</h4>
      </div>
      <div className={styles["card__price-container"]}>
        <p className={styles["card__price"]}>{price}</p>
        <p className={styles["card__change"]}>{priceChange}%</p>
      </div>

      {content}
    </div>
  );
};

export default Card;
