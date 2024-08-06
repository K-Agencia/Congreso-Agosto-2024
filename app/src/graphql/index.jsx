import { gql } from "@apollo/client";

export const REGISTER_ODONTOLOGO = gql`
  mutation RegisterUser($inputRegisterOdontologo: InputRegisterOdontologo!) {
    registerUser(InputRegisterOdontologo: $inputRegisterOdontologo)
  }
`;

export const REGISTER_USER_WIN = gql`
  mutation RegisterUserWin($id: Int!) {
    registerUserWin(id: $id)
  }
`;

export const LIST_USERS = gql`
  query GetlistUsers {
    getlistUsers {
      id
      cedula
      nombres
      apellidos
      reclamo
    }
  }
`

export const USER_BY_CEDULA = gql`
  query QueryUserByCedula($cedula: String!) {
    queryUserByCedula(cedula: $cedula)
  }
`;

export const GET_DATA_USER = gql`
  query GetDataUser($cedula: String!) {
    getDataUser(cedula: $cedula) {
      cedula
      nombres
      apellidos
      ciudad
      direccion
      celular
      email
      especialidad
    }
  }
`;

export const GET_LAST_UPDATE = gql`
  subscription Subscription {
    lastUpdate {
      id
      reclamo
    }
  }
`

export const SUBS_GET_LAST_USER = gql`
  subscription Subscription {
    getLastUser {
      id
      cedula
      nombres
      apellidos
      reclamo
    }
  }
`