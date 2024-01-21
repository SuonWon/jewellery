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

        <div className='grid grid-cols-10 gap-2 xl:grid-cols-9 2xl:grid-cols-11 w-full'>
            <div className='w-full xl:col-span-2'>
                <Sidebar />
            </div>
            <div className='col-span-9 flex xl:col-span-7 2xl:col-span-9'>
                <Routes>
                    <Route index element={<Brightness />}></Route>
                    <Route path='grade' element={<Grade />}></Route>
                    <Route path='brightness' element={<Brightness />}></Route>
                    <Route path='type' element={<StoneType />}></Route>
                    <Route path='uom' element={<UOM />}></Route>
                    <Route path='stone' element={<Stone />}></Route>
                    <Route path='walletCategory' element={<WalletCategory />}></Route>
                </Routes>
            </div>
        </div>
        
    );
}

export default Setup;