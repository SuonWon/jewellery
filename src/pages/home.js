import { Typography } from '@material-tailwind/react';
import { ReactComponent as HomeImage } from '../images/Home_01.svg';

function Home() {
    return (
        <div className='p-10 flex flex-col justify-center'>
            <Typography color='black' variant='h4'>
                Welcome to Jewellery POS
            </Typography>
            <HomeImage className='w-[600px] h-[600px]' />
        </div>
    );
};

export default Home;