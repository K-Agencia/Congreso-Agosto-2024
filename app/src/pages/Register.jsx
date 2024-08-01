import { useLazyQuery, useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { LIST_USERS, REGISTER_USER_WIN } from '../graphql';
import Loader from '../components/Loader';
import TableRegister from '../components/TableRegister';
import { Button, Modal } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { capitalizarPrimeraLetra } from '../helpers/capitalizarPrimeraLetra';
import toast from 'react-hot-toast';


const Register = () => {

  const [openModal, setOpenModal] = useState(false);
  const [user, setUser] = useState({});

  const [listUserQuery, { data, loading }] = useLazyQuery(LIST_USERS, {
    onError(err) {
      console.log(err.graphQLErrors);
      console.log(err.networkError);
    }
  })

  const [registerUserWinMutation, mutation] = useMutation(REGISTER_USER_WIN, {
    refetchQueries: [LIST_USERS],
    onCompleted() {
      toast.success("Se ha registrado correctamente");
      onClose();
    },
    onError(err) {
      console.log({ graphQLErrors: err.graphQLErrors });
      console.log({ networkError: err.networkError });
      toast.error("¡Ups! Tuvimos un error en el seistema, intentalo más tarde.");
    }
  })

  const columns = [
    {
      header: "id",
      accessorKey: "id",
      size: 30,
      meta: {
        align: 'center'
      },
      cell: info => info.row.index + 1
    },
    {
      header: "cedula",
      accessorKey: "cedula",
      meta: {
        align: 'center'
      }
    },
    {
      header: "nombres",
      accessorKey: "nombres",
      cell: info => capitalizarPrimeraLetra(info.getValue())
    },
    {
      header: "apellidos",
      accessorKey: "apellidos",
      cell: info => capitalizarPrimeraLetra(info.getValue())
    },
    {
      header: "entrega",
      accessorKey: "reclamo",
      meta: {
        align: 'center'
      },
      cell: info => {
        console.log();
        const reclamo = info.getValue();
        if (reclamo === 1) {
          return (
            <Button pill size={"sm"} color={'success'} className='p-0'>
              Entregado
            </Button>
          )
        }

        if (reclamo === 0) {
          return (
            <Button pill size={"sm"} color={'failure'} className='p-0' onClick={() => handleDataWin({
              id: info.row.original.id,
              nombres: info.row.original.nombres,
              apellidos: info.row.original.apellidos,
              cedula: info.row.original.cedula,
            })}>
              Sin Entregar
            </Button>
          )
        }
      }
    },
  ];

  const handleDataWin = (userid) => {
    setUser(userid)
    setOpenModal(true);
  }

  const onClose = () => {
    setUser({})
    setOpenModal(false);
  }

  const onSubmit = async () => {
    registerUserWinMutation({
      variables: {
        id: parseInt(user.id)
      }
    })
  }

  useEffect(() => {
    if (!data) {
      listUserQuery()
    }
  }, [data]);

  return (
    <>
      <h1 className='my-4 text-2xl text-center font-bold'>REGISTROS</h1>
      {data && <TableRegister data={data.getlistUsers} columns={columns} />}

      {user.id &&
        <Modal className='z-10' show={openModal} size="md" onClose={() => onClose()} popup>
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-yellow-400 dark:text-gray-200" />
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                <b>{user?.cedula}&nbsp;-&nbsp;{user?.nombres.toUpperCase()}&nbsp;{user?.apellidos.toUpperCase()}</b>
                <br />
                ¿Esta persona llegó a reclamar su premio?
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="success" onClick={() => onSubmit()}>
                  {"Si, llegó a reclamarlo"}
                </Button>
                <Button color="gray" onClick={() => onClose()}>
                  No, cancelar
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      }
      {loading || mutation.loading && <Loader />}

    </>
  )


};

export default Register;