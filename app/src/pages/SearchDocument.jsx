import { useLazyQuery } from '@apollo/client';
import InputText from '../components/InputText';
import { useForm } from 'react-hook-form';
import { USER_BY_CEDULA } from '../graphql';
import { Button } from 'flowbite-react';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { RoutersLink } from '../constants';

const SearchDocument = () => {

  const navigate = useNavigate();
  const location = useLocation();

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
        toast.success("Puedes pasar a jugar.");
        toast.success(res.data.queryUserByCedula);
        reset();
      } else {
        navigate(RoutersLink.FORMGAME, {
          state: {
            game: location.pathname.slice(1),
            cedula: data.cedula,
            message: res.data.queryUserByCedula
          }
        })
      }

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='container mx-auto px-8'>
      <form
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
          Registrarse
        </Button>
      </form>

      {loading && <Loader />}
    </div>
  );
};

export default SearchDocument;