import { Typography } from '@material-tailwind/react';
import { ReactComponent as HomeImage } from '../images/Home_01.svg';

function Home() {
    return (
        <div className='p-10 flex flex-col justify-center'>
            <Typography color='black' variant='h5' className='text-end mt-5'>
                Welcome to 
            </Typography>
            <Typography color='black' variant='h3' className='text-end'>
                Jewellery POS System
            </Typography>
            <HomeImage className='w-[600px] h-[400px]' />
        </div>
    );
};

export default Home;