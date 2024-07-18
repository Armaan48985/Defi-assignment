'use client'
import { Input } from '@/components/ui/input'
import { CoinList, HistoricalChart, SingleCoin, TrendingCoins } from '@/config/api'
import Image from 'next/image'
import Link from 'next/link'
import React, { Suspense, useEffect, useState } from 'react'
import { IoSearch } from "react-icons/io5";
import { FaCoins } from "react-icons/fa6";
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { useRouter } from 'next/navigation'
import { fetchChartData, fetchCoins, fetchTrendingCoins, numberWithCommas } from '../ApiFunctions'

// Register the necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);
  
export interface ChartData {
  [key: string]: number[][];
}

const Page = () => {
  const [search, setSearch] = useState('')
  const [coins, setCoins] = useState<any[]>([])
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<any>([]);
  const [current, setCurrent] = useState('trending');
  const [trendingCoins, setTrendingCoins] = useState<any[]>([])
  const [days, setDays] = useState(1)

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      const coinData = current === 'all' ? await fetchCoins() : await fetchTrendingCoins();
      if(coinData.length > 0) {
        setCoins(coinData);
        setLoading(false)
      }

      const allChartsData: ChartData = {};
      for (const coin of coinData) {
        const chartData = await fetchChartData(coin.id, days);
        allChartsData[coin.id] = chartData;
      }
      setChartData(allChartsData);
    };

    const fetchTrendingData = async () => {
      const trendingData = await fetchTrendingCoins();
      setTrendingCoins(trendingData);
    };

    fetchTrendingData();
    fetchAllData();
  }, [current]);


  const handleSearch = () => {
    return current === "trending" 
      ? trendingCoins.filter(coin =>
          coin.name.toLowerCase().includes(search.toLowerCase()) ||
          coin.symbol.toLowerCase().includes(search.toLowerCase())
        )
      : coins.filter(coin =>
          coin.name.toLowerCase().includes(search.toLowerCase()) ||
          coin.symbol.toLowerCase().includes(search.toLowerCase())
        );
  };

  

  const router = useRouter();
  const handlePage = () => {
    setCurrent(current === 'trending' ? 'all' : 'trending');
    router.refresh();
  }

  return (
    <div className="flex-center flex-col items-center bg-black text-white min-h-screen poppins-regular">
      <div className='w-full h-[200px] flex-center'>
        <h1 className='text-6xl font-bold poppins-bold ml-36 relative text-[#C5C5BF]'>
          <span className='text-[9rem] absolute left-[-5.6rem] top-[-.7rem] text-[#3a3aa1]'>C</span>rypto <br/>urrencies
        </h1>
      </div>

      <div className='bg-[#171738] flex-center w-[500px] border-[1px] border-slate-900 rounded-2xl py-1 px-3 mt-6'>
        <Input 
          placeholder="Search" 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className='bg-transparent border-none outline-none placeholder:text-gray-200 placeholder:text-sm'  
        />
        <span className='text-lg'><IoSearch /></span>
      </div>

      <div className='w-full flex items-center flex-col min-h-[600px] p-10 rounded-xl relative mt-4'>
        <div className='absolute right-14 top-[8px]'>
          <button onClick={handlePage} className='flex-center text-[#F1A204]'>
            see {current} coins 
            <span className='mt-1'>
              <MdKeyboardDoubleArrowRight />
            </span>
          </button>
        </div>
        <div className='w-full flex-between px-10 bg-[#14142f] py-3 rounded-t-xl pl-18 text-md font-bold brightness-75'>
          <div className='w-32 ml-8 flex-center gap-2'>Coin <span className=''><FaCoins /></span></div>
          <div className='w-32 ml-15'>Price(₹)</div>
          <div className='w-32 ml-10'>24h Change</div>
          <div className='w-32'>Market Cap</div>
        </div>

        {loading ? 
          <div className="flex w-full items-center justify-center min-h-screen">
            <div className="relative w-16 h-16">
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-t-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
              <div className="absolute top-0 left-0 w-12 h-12 border-4 border-t-4 border-transparent border-t-red-500 rounded-full animate-spin" style={{ animationDuration: '1.5s' }}></div>
              <div className="absolute top-0 left-0 w-8 h-8 border-4 border-t-4 border-transparent border-t-green-500 rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
            </div>
          </div>
          : 
          handleSearch().map((row) => {
            const profit = row.price_change_percentage_24h > 0;
            return (
              <Link href={`/coins/${row.name.toLowerCase()}`} key={row.id} className='w-full flex-between px-10 bg-[#171738] hover:bg-[#12122B] duration-500 py-3 border-b-[.5px] border-slate-600'>
                <div className='flex-center min-w-32 gap-6'>
                  <Image
                    src={row?.image}
                    alt={row.name}
                    width={40}
                    height={40}
                    className=''
                  />
                  <div className='flex flex-col gap-0'>
                    <span className='uppercase font-bold text-xl'>
                      {row.symbol}
                    </span>
                    <span className='text-gray-300 text-sm'>
                      {row.name}
                    </span>
                  </div>
                </div>

                <div className='w-32'>
                  {numberWithCommas(row.current_price.toFixed(2))}
                </div>

                <div className='flex-center flex-col'>
                  {chartData[row.id] &&  
                    <div style={{ width: '150px', height: '150px' }}>
                      <Line 
                        data={{
                          labels: chartData[row.id].slice(0,100).map((coin: any) => {
                            let date = new Date(coin[0]);
                            let time = date.getHours() > 12 ? `${date.getHours() - 12}:${date.getMinutes()} PM` : `${date.getHours()}:${date.getMinutes()} AM`;
                            return days === 1 ? time : date.toLocaleDateString();
                          }),
                          datasets: [{
                            data: chartData[row.id].map((coin: any) => coin[1]),
                            label: 'Price',
                            borderColor: profit ? '#07DA74' : '#FF0000',
                          }]
                        }}
                        options={{
                          scales: {
                            x: { display: false },
                            y: { display: false },
                          },
                          plugins: {
                            legend: { display: false },
                            tooltip: { enabled: false },
                          },
                          elements: {
                            point: { radius: 0 },
                          },
                        }}
                      />
                    </div>
                  }

                  <div className={`text-[.7rem] ${profit ? 'text-[#07DA74]' : 'text-red-500'} w-10`}>
                    ({profit && "+"}
                    {row.price_change_percentage_24h.toFixed(2)}%)
                  </div>
                </div>
                <div className='w-32'>
                  ₹ {numberWithCommas(row.market_cap.toString().slice(0, -6))}
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  )
}

export default Page
