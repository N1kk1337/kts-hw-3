import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { MultiDropdown, Option } from '@components/MultiDropdown';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

import './CoinListPage.scss';
// import CoinCard from './components/CoinCard';
import { Card } from '@components/Card';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Loader } from '@components/Loader';

export interface CoinData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: string;
  price_change_percentage_24h: string;
}

export default function CoinListPage() {
  const [inputValue, setInputValue] = useState('');
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [slicedCoins, setSlicedCoins] = useState<CoinData[]>([]);
  const [categories, setCategories] = useState<Option[]>([]);
  const [chosenCategories, setChosenCategories] = useState<Option[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handleInputChange = (value: string): void => {
    setInputValue(value);
  };

  const handleSearch = () => {
    fetchCoins(inputValue);
  };

  async function fetchCategories(): Promise<Option[]> {
    const url = 'https://api.coingecko.com/api/v3/coins/categories/list';
    const response = await axios.get<{ category_id: string; name: string }[]>(
      url,
    );
    const options: Option[] = response.data.map((obj) => ({
      key: obj.category_id,
      value: obj.name,
    }));
    setCategories(options);
    return options;
  }

  async function fetchCoins(search: string = 'usd') {
    // todo есть подозрение что проще/лучше получить полный список монет и просто отфильтровать их уже в коде
    // todo но в задании сказано получать по АПИ, будем получать
    let url = '';
    if (chosenCategories.length === 0) {
      url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${search}`;
      const response = await axios.get<CoinData[]>(url);
      setCoins(response.data);
    } else {
      setCoins([]);
      chosenCategories.forEach(async (cat) => {
        url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${search}&category=${cat.key}`;
        const response = await axios.get<CoinData[]>(url);
        setCoins([...coins, ...response.data.flat()]);
      });
    }
  }

  const getMoreCoins = async () => {
    setCurrentPage(currentPage + 1);
  };

  useEffect(() => {
    fetchCategories();
    fetchCoins();
  });

  useEffect(() => {
    console.log(currentPage);
    setSlicedCoins(coins.slice(0, 20 * currentPage));
  }, [currentPage, coins]);

  useEffect(() => {
    setSlicedCoins([]);
    fetchCoins();
    setCurrentPage(1);
  }, [chosenCategories]);

  return (
    <div className="coin-list-page">
      <div className="coin-list__search">
        <Input
          placeholder="Search Cryptocurrency"
          value={inputValue}
          onChange={handleInputChange}
        ></Input>
        <Button onClick={handleSearch} className="search-btn">
          &#x1F50D;
        </Button>
      </div>
      <div className="coin-list__categories">
        <h2>Coins</h2>{' '}
        <MultiDropdown
          options={categories}
          value={chosenCategories}
          onChange={setChosenCategories}
          pluralizeOptions={(values: Option[]) =>
            values.length === 0 ? 'Choose coins' : `Chosen: ${values.length}`
          }
        ></MultiDropdown>
      </div>
      <div className="coin-list__tabs"></div>
      <div className="coin-list__list">
        <InfiniteScroll
          dataLength={slicedCoins.length}
          next={getMoreCoins}
          hasMore={true}
          loader={<Loader></Loader>}
          height="700px"
          endMessage={
            <p style={{ textAlign: 'center' }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
        >
          {slicedCoins &&
            slicedCoins.map((coin) => {
              return (
                <Card
                  key={coin.id}
                  image={coin.image}
                  title={coin.name}
                  subtitle={coin.symbol.toUpperCase()}
                  price={coin.current_price}
                  priceChange={coin.price_change_percentage_24h}
                ></Card>
              );
            })}
        </InfiniteScroll>
      </div>
    </div>
  );
}
