import { useLazyQuery } from '@apollo/client';
import InputText from '../components/InputText';
import { useForm } from 'react-hook-form';
import { USER_BY_CEDULA } from '../graphql';
import { Button } from 'flowbite-react';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { RoutersLink } from '../constants';

const SearchDocument = () => {

  const navigate = useNavigate();

  const [userByCedulaQuery, { loading }] = useLazyQuery(USER_BY_CEDULA, {
    onError(e) {
      console.log(e.graphQLErrors);
      console.log(e.networkError);
    }
  })

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      cedula: ''
    }
  })

  const messageRequired = "Este campo es requerido.";

  const onSubmit = async (data) => {
    try {
      const res = await userByCedulaQuery({
        variables: {
          cedula: `${data.cedula}`
        }
      })

      if (res.data.queryUserByCedula === "Ya sus datos han sido actualizados.") {
        toast.success(res.data.queryUserByCedula);
        reset();
      } else {
        toast(res.data.queryUserByCedula, {
          icon: '⚠️',
        });
        navigate(RoutersLink.FORM, {
          state: {
            cedula: data.cedula,
            message: res.data.queryUserByCedula,
          }
        })
      }

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='container min-w-screen min-h-screen flex flex-col justify-center items-center mx-auto px-8'>

      <p className='mb-3'>Ingrese su cédula para activar el reclamo del obsequio.</p>
      <form
        className='w-full'
        onSubmit={handleSubmit(onSubmit)}
      >
        <InputText
          {...register("cedula", {
            required: messageRequired
          })}
          type={'number'}
          placeholder={"Cedula"}
          label={"Cedula"}
          error={errors.cedula}
          required={true}
        />

        <Button
          className='w-full my-5'
          type={'submit'}
        >
          Activar
        </Button>
      </form>

      {loading && <Loader />}
    </div>
  );
};

export default SearchDocument;