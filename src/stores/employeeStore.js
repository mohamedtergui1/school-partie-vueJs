import { defineStore } from "pinia";
import instance from "@/axios-config.js";
// import router from "@/router";

import { useToast } from "vue-toastification";
const employeeInitiolvalue = {
  id: null,
  email: "",
  firstName: "",
  lastName: "",
  address: "",
  role_id : "" ,
  number_phone: "",
  image: "",
  username: "",
};
export const employeeStore = defineStore("employeeStore", {
  id: "employeeStore",
  state: () => ({
    employee: employeeInitiolvalue,
    employees: {},
    allResponse: {},
    idDeleteemployee: null,
    isShowModalDelete: false,
    loader: false,
    isShowModal: false,
  }),
  getters: {
    getemployeeById: function (state) {
      return function (ID) {
        return state.employees.find((obj) => obj.id === ID);
      };
    },
    intialValues: function (state) {
      return employeeInitiolvalue;
    },
    getterTeachers: (state) => {
      
      return state.employees.map((employee) => ({
        value: employee.id,
        name: employee.firstName + " " + employee.lastName,
      }));
    },
  },
  actions: {
    async getTeachers() {
      try {
        const response = await instance.get("/admin/allteachers");
        console.log(response);
        this.employees = response.data.data;
      } catch (err) {
        console.log(err);
      }
    },

    async getemployees() {
      try {
        const response = await instance.get("/admin/employees");
        this.allResponse = response.data;
        this.employees = this.allResponse.data.data;
        console.log(response);
      } catch (err) {
        console.log(err);
      }
    },
    async deleteemployee() {
      this.loader = true;
      try {
        const response = await instance.delete(
          "/admin/employees/" + this.idDeleteemployee
        );
        console.log(response);
        if (response.status === 200) {
          this.employees = this.employees.filter(
            (t) => t.id !== this.idDeleteemployee
          );

          this.idDeleteemployee = null;
          this.isShowModalDelete = false;
          useToast().success("employee deleted with success", {
            timeout: 2000,
          });
        }
      } catch (err) {
        console.log(err);
      } finally {
        this.loader = false;
      }
    },
    async updateAndEdit() {
      if (this.employee.id) {
        // update
        try {
          // let formData = new FormData();
          // for (const [key, value] of Object.entries(this.employee)) {
          //   console.log(key + " " + value);
          //   formData.append(key, value);
          // }

          const response = await instance.put(
            "/admin/employees/" + this.employee.id,
            this.employee
          );

           
            console.log(response);
            this.employees = this.employees.map((t) => {
              if (t.id !== this.employee.id) return t;
              else return response.data.data;
            });

            this.employee = employeeInitiolvalue;

            this.isShowModal = false;

            useToast().success("employee updated with success", {
              timeout: 2000,
            });
          
        } catch (err) {
          console.log(err);
        } finally {
          this.loader = false;
        }
      } else {
        try {
          let formData = new FormData();

          for (const [key, value] of Object.entries(this.employee)) {
            formData.append(key, value);
          }
          formData.username = this.employee.username;
          const response = await instance.post("/admin/employees", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          console.log(response);
          this.employees.unshift(response.data.data);
          this.employee = employeeInitiolvalue;
          this.isShowModal = false;
          useToast().success("employee created with success", {
            timeout: 2000,
          });
        } catch (err) {
          console.log(err);
        } finally {
          this.loader = false;
        }
      }
    },
  },
});