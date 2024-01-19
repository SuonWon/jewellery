import Brightness from '../pages/brightness';
import Grade from '../pages/grade';
import Stone from '../pages/stone';
import StoneType from '../pages/type';
import UOM from '../pages/uom';
import WalletCategory from '../pages/walletCategory';
import Sidebar from './sidebar';
import { Route, Routes } from 'react-router-dom';


function Setup() {
    return (

        <div className='grid grid-cols-10 gap-2 xl:grid-cols-7'>
            <div className='w-full col-span-1 xl:col-start-2 '>
                <Sidebar />
            </div>
            <div className='col-span-8 flex xl:col-span-5' >
                <Routes>
                    <Route index element={<Brightness />}></Route>
                    <Route path='home/master/grade' element={<Grade />}></Route>
                    <Route path='home/master/brightness' element={<Brightness />}></Route>
                    <Route path='home/master/type' element={<StoneType />}></Route>
                    <Route path='home/master/uom' element={<UOM />}></Route>
                    <Route path='home/master/stone' element={<Stone />}></Route>
                    <Route path='home/master/walletCategory' element={<WalletCategory />}></Route>
                </Routes>
            </div>
        </div>
        
    );
}

export default Setup;