import { GraphQLError, subscribe } from "graphql";
import { QUERY_DB } from "../db/query.js";
import Odontologos from "../model/Odontologos.js";
import { PubSub } from "graphql-subscriptions";

const TABLE = "congreso_agosto_2024";
const pubSub = new PubSub();

export default {
  Query: {
    async getlistUsers() {
      try {
        const sql = `SELECT id, cedulas as cedula, nombres, apellidos, ciudad, direccion, celular, email, especialidad, reclamo FROM ${TABLE};`;
        const [rows] = await QUERY_DB({ sql });

        return rows;
      } catch (error) {
        console.log(error);
      }
    },
    async queryUserByCedula(_, { cedula }) {
      try {
        // const data = await Odontologos.find({ cedula: `CO${cedula}` });

        // if (data.length === 0) {
        //   return "El usuario no se encuentra registrado."
        // }

        const sendMysqlQuery = await QUERY_DB({
          sql: `SELECT count(*) as count FROM ${TABLE} WHERE cedulas = ?`,
          values: cedula
        });

        if (sendMysqlQuery[0][0].count > 0) {
          return "Ya sus datos han sido actualizados."
        }

        return "Necesitamos actualizar sus datos"
      } catch (error) {
        console.log(error);
        throw new GraphQLError("¡Ups! Tuvimos un error en el seistema, intentalo más tarde.")
      }
    },
    async getDataUser(_, { cedula }) {
      try {
        const data = await Odontologos.find({ cedula: `CO${cedula}` });

        if (data.length === 0) {
          throw "El usuario no se encuentra registrado."
        }

        const { nombres, apellidos, ciudad, direccion, celular, email, especialidad } = data[0];

        return { cedula, nombres, apellidos, ciudad, direccion, celular, email, especialidad }

      } catch (error) {
        if (error === "El usuario no se encuentra registrado.") {
          throw new GraphQLError(error)
        }
        console.log(error);
        throw new GraphQLError("¡Ups! Tuvimos un error en el seistema, intentalo más tarde.")
      }
    }
  },
  Mutation: {
    async registerUser(_, { InputRegisterOdontologo }) {
      try {

        const { cedula, nombres, apellidos, ciudad, direccion, celular, email, especialidad } = InputRegisterOdontologo;

        const select = await Odontologos.find({ cedula: `CO${cedula}` });

        const nuevo = select[0] === undefined ? 1 : 0;

        await QUERY_DB({
          sql: `INSERT INTO ${TABLE} (cedulas, nombres, apellidos, ciudad, direccion, celular, email, especialidad, nuevo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          values: [cedula, nombres, apellidos, ciudad, direccion, celular, email, especialidad, nuevo]
        });

        const [rows] = await QUERY_DB({
          sql: `SELECT id, cedulas as cedula, nombres, apellidos, ciudad, direccion, celular, email, especialidad, reclamo FROM ${TABLE} ORDER BY id DESC LIMIT 1;`
        });

        pubSub.publish('GET_LAST_USER', { getLastUser: rows[0] })

        return "Sus datos se han actualizado correctamente"

      } catch (error) {
        console.log(error);
        throw new GraphQLError("¡Ups! Tuvimos un error en el seistema, intentalo más tarde.")
      }
    },
    async registerUserWin(_, { id }) {

      try {
        const sendMysqlQuery = await QUERY_DB({
          sql: `SELECT id, reclamo FROM ${TABLE} WHERE id = ?;`,
          values: id
        });

        if (sendMysqlQuery[0][0].reclamo === 1) {
          return "Ya ha reclamado el premio"
        }

        await QUERY_DB({
          sql: `UPDATE ${TABLE} SET reclamo = '1' WHERE (id = ?);`,
          values: id
        });

        const [rows] = await QUERY_DB({
          sql: `SELECT id, cedulas as cedula, nombres, apellidos, ciudad, direccion, celular, email, especialidad, reclamo FROM ${TABLE} WHERE id = ?;`,
          values: id
        });

        pubSub.publish(`GET_LAST_UPDATE`, { lastUpdate: rows[0] })

        return "Puede reclamar premio"

      } catch (error) {
        console.log(error);
        throw new GraphQLError("¡Ups! Tuvimos un error en el seistema, intentalo más tarde.")
      }
    },
    // async changeUserWin(_, { cedula }) {
    //   try {
    //     await QUERY_DB({
    //       sql: `UPDATE ${TABLE} SET reclamo = '1' WHERE (id = ?);`,
    //       values: cedula
    //     });

    //     return "Sin reclamar premio"
    //   } catch (error) {

    //   }
    // }
  },
  Subscription: {
    listUsers: {
      subscribe: () => pubSub.asyncIterator(['GET_USERS'])
    },
    lastUpdate: {
      subscribe: () => pubSub.asyncIterator([`GET_LAST_UPDATE`])
    },
    getLastUser: {
      subscribe: () => pubSub.asyncIterator([`GET_LAST_USER`])
    }
  }
}

// CO4444444

