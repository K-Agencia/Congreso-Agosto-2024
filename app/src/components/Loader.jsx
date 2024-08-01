import { Spinner } from 'flowbite-react';

const Loader = () => {
  return (
    <div className='w-screen h-lvh flex flex-col justify-center items-center bg-slate-200 opacity-55 absolute top-0 right-0 z-20'>
      <Spinner className='w-28 h-28 text-center' />
      <h1 className='text-2xl'>Cargando...</h1>
    </div>
  );
};

export default Loader;