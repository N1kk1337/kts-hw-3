import './Card.scss';

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
  onClick?: React.MouseEventHandler;
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
    <div onClick={onClick} className="card" {...props}>
      <img className="card__img" src={image} alt="" />

      <div>
        <h3 className="card__title">{title}</h3>
        <h4 className="card__subtitle">{subtitle}</h4>
      </div>
      <div className="card__price-container">
        <p className="card__price">${price}</p>
        <p className="card__change">{priceChange}%</p>
      </div>

      {content}
    </div>
  );
};
