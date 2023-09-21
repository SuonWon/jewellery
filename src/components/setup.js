import Brightness from '../pages/brightness';
import Grade from '../pages/grade';
import Stone from '../pages/stone';
import StoneType from '../pages/type';
import UOM from '../pages/uom';
import Sidebar from './sidebar';
import { Route, Routes } from 'react-router-dom';


function Setup() {
    return (

        <div className='flex justify-center'>
            <Sidebar />
            <div className='flex overflow-auto' style={{maxHeight: 'calc(100vh - 60px)'}}>
                <Routes>
                    <Route index element={<Brightness />}></Route>
                    <Route path='home/master/grade' element={<Grade />}></Route>
                    <Route path='home/master/brightness' element={<Brightness />}></Route>
                    <Route path='home/master/type' element={<StoneType />}></Route>
                    <Route path='home/master/uom' element={<UOM />}></Route>
                    <Route path='home/master/stone' element={<Stone />}></Route>
                </Routes>
            </div>
        </div>
        
    );
}

export default Setup;