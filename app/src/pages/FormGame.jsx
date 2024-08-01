import { useForm } from 'react-hook-form';
import InputText from '../components/InputText';
import { Button, Modal } from 'flowbite-react';
import { useMutation, useQuery } from '@apollo/client';
import { GET_DATA_USER, REGISTER_ODONTOLOGO } from '../graphql';
import { useEffect, useState } from 'react';
import { capitalizarPrimeraLetra } from '../helpers/capitalizarPrimeraLetra';
import Loader from '../components/Loader';
import { useLocation } from 'react-router-dom';
import { CiWarning } from "react-icons/ci";
import toast from 'react-hot-toast';

const FormGame = () => {

  const { state } = useLocation();
  const navigate = useLocation();
  const messageRequired = "Este campo es requerido."

  const [openModal, setOpenModal] = useState(true);

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    defaultValues: {
      cedula: '',
      nombres: '',
      apellidos: '',
      ciudad: '',
      direccion: '',
      celular: '',
      email: '',
      especialidad: '',
    }
  })

  const [registerUserMutation, mutation] = useMutation(REGISTER_ODONTOLOGO, {
    onError(e) {
      console.log(e.graphQLErrors);
      console.log(e.networkError);

      toast.error("¡Ups! Tuvimos un error, intentalo más tarde.")
    }
  })

  const query = useQuery(GET_DATA_USER, {
    variables: {
      cedula: state.cedula
    },
    onError(e) {
      console.log(e.graphQLErrors);
      console.log(e.networkError);

      toast.error("¡Ups! Tuvimos un error, intentalo más tarde.");
      navigate(`/${state.game}`)

    }
  })

  const onSubmit = async (data) => {
    const { cedula, nombres, apellidos, ciudad, direccion, celular, email, especialidad } = data;
    try {
      const res = await registerUserMutation({
        variables: {
          inputRegisterOdontologo: {
            cedula, nombres, apellidos, ciudad, direccion, celular, email, especialidad
          }
        }
      })

      navigate(`/${state.game}`);
      toast.success("Puedes pasar a jugar.");
      toast.success(res.data.registerUser);

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (query.data) {
      const { cedula, nombres, apellidos, ciudad, direccion, celular, email, especialidad } = query.data.getDataUser;

      setValue('cedula', cedula);
      setValue('nombres', capitalizarPrimeraLetra(nombres));
      setValue('apellidos', capitalizarPrimeraLetra(apellidos));
      setValue('ciudad', capitalizarPrimeraLetra(ciudad));
      setValue('direccion', capitalizarPrimeraLetra(direccion));
      setValue('celular', capitalizarPrimeraLetra(celular));
      setValue('email', email.toLowerCase());
      setValue('especialidad', capitalizarPrimeraLetra(especialidad));
    }
  }, [query.data]);

  return (
    <div className='container mx-auto px-8'>
      <form
        onSubmit={handleSubmit(onSubmit)}
      >
        <InputText
          {...register("cedula", {
            required: messageRequired,
            maxLength: {
              value: 15,
              message: "Ha superado el número máximo de caracteres (max. 15)."
            }
          })}
          type={'number'}
          placeholder={"Cedula"}
          label={"Cedula"}
          error={errors.cedula}
          required={true}
          defaultValues={watch('cedula')}
          disabled={true}
        />

        <InputText
          {...register("nombres", {
            required: messageRequired,
            maxLength: {
              value: 45,
              message: "Ha superado el número máximo de caracteres (max. 45)."
            }
          })}
          placeholder={"Nombres"}
          label={"Nombres"}
          error={errors.nombres}
          required={true}
          defaultValues={watch('nombres')}
        />

        <InputText
          {...register("apellidos", {
            required: messageRequired,
            maxLength: {
              value: 45,
              message: "Ha superado el número máximo de caracteres (max. 45)."
            }
          })}
          placeholder={"Apellidos"}
          label={"Apellidos"}
          error={errors.apellidos}
          required={true}
          defaultValues={watch('apellidos')}
        />

        <InputText
          {...register("ciudad", {
            required: messageRequired,
            maxLength: {
              value: 45,
              message: "Ha superado el número máximo de caracteres (max. 45)."
            }
          })}
          placeholder={"Ciudad"}
          label={"Ciudad"}
          error={errors.ciudad}
          required={true}
          defaultValues={watch('ciudad')}
        />

        <InputText
          {...register("direccion", {
            required: messageRequired,
            maxLength: {
              value: 200,
              message: "Ha superado el número máximo de caracteres (max. 200)."
            }
          })}
          placeholder={"Dirección"}
          label={"Dirección"}
          error={errors.direccion}
          required={true}
          defaultValues={watch('direccion')}
        />

        <InputText
          {...register("celular", {
            required: messageRequired,
            maxLength: {
              value: 20,
              message: "Ha superado el número máximo de caracteres (max. 20)."
            }
          })}
          type={"number"}
          placeholder={"Celular"}
          label={"Celular"}
          error={errors.celular}
          required={true}
          defaultValues={watch('celular')}
        />

        <InputText
          {...register("email", {
            required: messageRequired,
            maxLength: {
              value: 200,
              message: "Ha superado el número máximo de caracteres (max. 200)."
            }
          })}
          type={"email"}
          placeholder={"Email"}
          label={"Email"}
          error={errors.email}
          required={true}
          defaultValues={watch('email')}
        />

        <InputText
          {...register("especialidad", {
            required: messageRequired,
            maxLength: {
              value: 45,
              message: "Ha superado el número máximo de caracteres (max. 45)."
            }
          })}
          placeholder={"Especialidad"}
          label={"Especialidad"}
          error={errors.especialidad}
          required={true}
          defaultValues={watch('especialidad')}
        />

        <Button
          className='w-full my-5'
          type={'submit'}
        >
          Actualizar Datos
        </Button>
      </form>

      {query.loading || mutation.loading && <Loader />}

      <Modal positions={'center'} show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <CiWarning className="mx-auto mb-4 h-14 w-14 text-amber-500" />
            <h3 className="mb-5 text-lg font-normal text-gray-500">
              Necesitamos actualizar sus datos, solo tomará un momento
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="success" onClick={() => setOpenModal(false)}>
                {"Actualizar"}
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default FormGame;