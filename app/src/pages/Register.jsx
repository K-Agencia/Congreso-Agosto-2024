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
  const [users, setUsers] = useState([]);

  const [listUserQuery, { data, loading }] = useLazyQuery(LIST_USERS, {
    onError(err) {
      console.log(err.graphQLErrors);
      console.log(err.networkError);
    },
    onCompleted(data) {
      setUsers(data.getlistUsers)
    }
  })

  const [registerUserWinMutation, mutation] = useMutation(REGISTER_USER_WIN, {
    onCompleted(e) {
      toast.success("Se ha registrado correctamente");
      console.log(e);
      setUsers((prevItems) =>
        prevItems.map((item) =>
          item.id === user.id ? { ...item, reclamo: 1 } : item
        )
      );
      onClose();

    },
    onError(err) {
      console.log({ graphQLErrors: err.graphQLErrors });
      console.log({ networkError: err.networkError });
      toast.error("¡Ups! Tuvimos un error en el seistema, intentalo más tarde.");
    }
  })

  // useSubscription(SUBS_GET_LAST_USER, {
  //   onData: ({ data }) => {
  //     if (!data.data) return;
  //     const updatedUser = data.data.getLastUser;
  //     setUsers(prevUsers => {
  //       return [...prevUsers, updatedUser];
  //     });
  //   }
  // });

  // useSubscription(GET_LAST_UPDATE, {
  //   onData: ({ data }) => {
  //     if (!data.data) return;
  //     console.log(data);
  //     const updatedRecord = data.data.lastUpdate;
  //     console.log({ updatedRecord });
  //     setUsers((prevUsers) => {
  //       return prevUsers.map((user) => {
  //         if (user.id === updatedRecord.id) {
  //           return {
  //             ...user,
  //             reclamo: updatedRecord.reclamo
  //           };
  //         } else {
  //           return user;
  //         }
  //       })
  //     });
  //   }
  // });


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

  const handleDataWin = (dataUser) => {
    setUser(dataUser)
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

  // console.log(users);

  useEffect(() => {
    if (!data) {
      listUserQuery()
    }
  }, [data]);

  return (
    <>
      <h1 className='my-4 text-2xl text-center font-bold'>REGISTROS</h1>
      <TableRegister data={users} columns={columns} listUserQuery={listUserQuery} />

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
      {loading && <Loader />}
      {mutation.loading && <Loader />}

    </>
  )


};

export default Register;