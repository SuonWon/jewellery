import { ReactComponent as HomeImage } from '../images/Home_01.svg';

function Home() {
    return (
        <div className='p-10 flex items-center justify-center'>
            <HomeImage className='w-[600px] h-[600px]' />
        </div>
    );
};

export default Home;