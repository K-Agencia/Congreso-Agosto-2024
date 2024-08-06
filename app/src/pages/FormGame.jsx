import { useForm } from 'react-hook-form';
import InputText from '../components/InputText';
import { Button, Modal } from 'flowbite-react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { GET_DATA_USER, REGISTER_ODONTOLOGO } from '../graphql';
import { useEffect, useState } from 'react';
import { capitalizarPrimeraLetra } from '../helpers/capitalizarPrimeraLetra';
import Loader from '../components/Loader';
import { useLocation, useNavigate } from 'react-router-dom';
import { CiWarning } from "react-icons/ci";
import toast from 'react-hot-toast';
import InputCheckbox from '../components/InputCheckbox';
import { RoutersLink } from '../constants';

const FormGame = () => {

  const { state } = useLocation();
  const navigate = useNavigate();
  const messageRequired = "Este campo es requerido."

  const [openModal, setOpenModal] = useState(true);
  const [openModalPolitica, setOpenModalPolitica] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitted }, watch, setValue } = useForm({
    defaultValues: {
      cedula: '',
      nombres: '',
      apellidos: '',
      ciudad: '',
      direccion: '',
      celular: '',
      email: '',
      especialidad: '',
      politica: false
    }
  })

  const [registerUserMutation, mutation] = useMutation(REGISTER_ODONTOLOGO, {
    onCompleted() {
      toast.success("¡Perfecto!, Muchas gracias por participar.");
      navigate('/');
    },
    onError(e) {
      console.log(e.graphQLErrors);
      console.log(e.networkError);

      toast.error("¡Ups! Tuvimos un error, intentalo más tarde.")
    }
  })

  const [lazyQuery, query] = useLazyQuery(GET_DATA_USER, {
    onError(e) {
      if (e.graphQLErrors[0].message !== "El usuario no se encuentra registrado.") {
        console.log(e.graphQLErrors);
        console.log(e.networkError);
        toast.error("¡Ups! Tuvimos un error, intentalo más tarde.")
      } else {
        setValue('cedula', state.cedula);
      }
    }
  })

  const onSubmit = async (data) => {

    const { cedula, nombres, apellidos, ciudad, direccion, celular, email, especialidad } = data;

    registerUserMutation({
      variables: {
        inputRegisterOdontologo: {
          cedula, nombres, apellidos, ciudad, direccion, celular, email, especialidad
        }
      }
    })
  }

  useEffect(() => {
    if (state.message == "Necesitamos actualizar sus datos") {
      lazyQuery({
        variables: {
          cedula: state.cedula
        }
      })
    }
  }, []);

  useEffect(() => {
    if (query.data && isSubmitted === false) {
      const { cedula, nombres, apellidos, ciudad, direccion, celular, email, especialidad } = query.data.getDataUser;
      console.log(query.data);

      setValue('cedula', cedula);
      setValue('nombres', nombres !== "" ? capitalizarPrimeraLetra(nombres) : "");
      setValue('apellidos', apellidos !== "" ? capitalizarPrimeraLetra(apellidos) : "");
      setValue('ciudad', ciudad !== "" ? capitalizarPrimeraLetra(ciudad) : "");
      setValue('direccion', direccion !== "" ? capitalizarPrimeraLetra(direccion) : "");
      setValue('celular', celular !== "" ? capitalizarPrimeraLetra(celular) : "");
      setValue('email', email.toLowerCase());
      setValue('especialidad', especialidad !== "" ? capitalizarPrimeraLetra(especialidad) : "");
    }
  }, [query.data]);


  return (
    <div className='container my-5 mx-auto px-8'>
      <h1 className='mb-3 text-center font-bold text-2xl'>Actualización de datos</h1>
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

        <InputCheckbox
          {...register('politica', {
            required: "Este campo es requerido"
          })}
          required={true}
          error={errors.politica}
        >
          Estoy de acuerdo con la <span className="text-blue-600 underline hover:no-underline dark:text-blue-500" onClick={() => setOpenModalPolitica(true)}>Politica de tratatiemto de datos</span>.
        </InputCheckbox>

        <Button
          className='w-full my-5'
          type={'submit'}
        >
          Actualizar Datos
        </Button>

        <Button
          outline
          className='w-full my-5'
          type={'button'}
          onClick={() => navigate(RoutersLink.INDEX)}
        >
          Cancelar
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

      <Modal show={openModalPolitica} onClose={() => setOpenModalPolitica(false)}>
        <Modal.Header>Habeas Data</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              Autorizo la recolección, almacenamiento, uso, tratamiento, y transmisión internacional o a terceros de mis datos personales por parte de <b>COLGATE PALMOLIVE COMPAÑÍA</b> con <b>NIT 890.300.546-6</b>, con el fin de recibir información sobre sus productos, campañas publicitarias y promociones, hacer parte de sus actividades para profesionales de la salud y recibir información comercial especializada de la misma. Esto de acuerdo a lo establecido en la Ley 1581 de 2012 y el decreto 377 de 2013, y conforme a la política de datos personales disponible en <a href="https://www.colgatepalmolive.com.co/legal-privacy-policy" className="text-cyan-600 hover:underline dark:text-cyan-500">https://www.colgatepalmolive.com.co/legal-privacy-policy</a>. Entendiendo que puedo solicitar la modificación o supresión de mis datos personales en cualquier momento.
            </p>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default FormGame;