'use client'
import { fetchChartData, fetchSingleCoin, numberWithCommas } from '@/app/ApiFunctions'
import { SingleCoin } from '@/config/api'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
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
import { Button } from '@/components/ui/button'

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

const Page = () => {

  const [coinData, setCoinData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [chartData, setChartData] = useState<number[][]>([]);
  const [days, setDays] = useState(1)
  const path = usePathname()

  const fetchCoinData = async () => {
    try {
      const coinId = path.split('/coins/')[1].toLowerCase();
      console.log("Fetching data for coin ID:", coinId);

      const data = await fetchSingleCoin(coinId);
      console.log("Data fetched:", data);

      if (data && Object.keys(data).length > 0) { // Changed condition to check if data is an object and has keys
        console.log("Setting coin data");
        setCoinData(data);
        setLoading(false);
      } else {
        console.error('No data found or data is empty');
      }
    } catch (error) {
      console.error('Error fetching coin data:', error);
    }
  };

  useEffect(() => {
    fetchCoinData();
  }, []);


  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.warn('Loading is taking longer than expected, reloading the page...');
        window.location.reload();
      }
    }, 5000);

    return () => clearTimeout(timeoutId); 
  }, [loading]);

  // Simulate loading
  useEffect(() => {
    const fakeLoading = setTimeout(() => {
      setLoading(false);
    }, 5000); // Simulate 5 seconds of loading

    return () => clearTimeout(fakeLoading);
  }, []);

  useEffect(() => {
    if (!coinData) return;

    const fetchChart = async () => {
      const data = await fetchChartData(coinData.id, days);

      if (data) {
        setChartData(data);
      }
    };

    fetchChart();
  }, [coinData, days]);

  const price = coinData?.market_data?.current_price.inr
  const marketCap = coinData?.market_data?.market_cap.inr
  const rank = coinData?.market_cap_rank
  const profit = coinData?.market_data?.[`price_change_percentage_${days == 1 ? '24h' : days == 7 ? '7d' : days == 30 ? '30d' : days == 365 ? '1y' : ''}`];

  return (
    <div className='w-full min-h-screen bg-black'>
      {loading ? 
         <div className="flex items-center justify-center min-h-screen">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
         : 
      (
      <div className='w-full min-h-screen flex'>
            <div className='flex flex-col gap-4 w-[450px] border-r-[1px] border-slate-600 min-h-screen p-4'>
              <div className='flex-center flex-col gap-6 my-8'>
                <Image src={coinData?.image?.large} alt={coinData?.name} width={130} height={130} />
               <div className='flex-center gap-4 ml-10'>
                <h1 className='text-white text-5xl font-bold'>{coinData?.name}</h1>
                <span className={`text-[1.2rem] flex items-end font-semibold ${profit > 0 ? 'text-[#07DA74]' : 'text-[#FF0000]'}`}>
                  ({profit > 0 ? `+${profit.toFixed(2)}` : profit.toFixed(2)}%)
                </span>
               </div>
              </div>
            
              <div className='px-6 text-gray-300 font-semibold'>
                <h1 className='text-md flex-between'>Rank : <span className='text-white font-bold text-2xl'>{rank}</span></h1>
                <div className='w-[360px] h-[1px] bg-slate-600 flex-center my-4 ml-1'></div>
                <h1 className='text-md flex-between'>Price :
                  <span className='text-white font-bold text-2xl'>
                    ₹{price && numberWithCommas(price)}
                    
                  </span>
                </h1>
                <div className='w-[360px] h-[1px] bg-slate-600 flex-center my-4 ml-1'></div>
                <h1 className='text-md flex-between'>Market Cap : <span className='text-white font-bold text-2xl'>₹{marketCap && numberWithCommas(marketCap)}</span></h1>
              </div>

              <div className='mt-12 px-6 text-gray-200'>
                  <p className='text-md word-spacing'>{coinData?.description.en.split(". ")[0]}.</p>
              </div>
            </div>

            <div className='w-full min-h-screen flex-center flex-col'>
              {chartData.length > 0 &&  
                <div style={{width: "900px", height: "550px"}} className='min-h-[550px]'>
                  <Line 
                    data={{
                      labels: chartData.map((coin) => {
                        let date = new Date(coin[0]);
                        let time = date.getHours() > 12 ? `${date.getHours() - 12}:${date.getMinutes()} PM` : `${date.getHours()}:${date.getMinutes()} AM`;
                        return days === 1 ? time : date.toLocaleDateString();
                      }),
                      datasets: [{
                        data: chartData.map((coin) => coin[1]),
                        label: 'Price',
                        borderColor: profit > 0 ? '#07DA74' : '#FF0000',
                      }]
                    }}
                  />
                </div>
              }
              <div className='w-full flex-center gap-6'>
                <Button onClick={() => setDays(1)} className={`px-14 ${days == 1 ? 'bg-yellow-600' : 'bg-[#171738]'}  hover:bg-[#12122B] duration-500`}>24h</Button>
                <Button onClick={() => setDays(7)} className={`px-14 ${days == 7 ? 'bg-yellow-600' : 'bg-[#171738]'}  hover:bg-[#12122B] duration-500`}>7D</Button>
                <Button onClick={() => setDays(30)} className={`px-14 ${days == 30 ? 'bg-yellow-600' : 'bg-[#171738]'}  hover:bg-[#12122B] duration-500`}>1M</Button>
                <Button onClick={() => setDays(365)} className={`px-14 ${days == 365 ? 'bg-yellow-600' : 'bg-[#171738]'}  hover:bg-[#12122B] duration-500`}>1Yr</Button>
              </div>
            </div>

      </div>
      )}
    </div>
  )
}

export default Page
