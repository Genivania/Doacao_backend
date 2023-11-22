const supertest = require("supertest");
const app = require("../app.js");

const BASE_URL = "/api/v1";

const userController = require("../controller/userController");
const hospitalController = require("../controller/hospitalController.js");
const siteController = require("../controller/siteController.js");
const reviewController = require("../controller/reviewController.js");
const donationBankController = require("../controller/donationBankController.js");
const bookScheduleController = require("../controller/bookScheduleController.js");
const scheduleController = require("../controller/scheduleController.js");
const scheduleStatusController = require("../controller/scheduleStatusController.js");
const campaignController = require("../controller/campaignController.js");

//FAZER TESTE DE VALIDAÇÃO DE ID

//HOSPITAL TESTS
describe("Integration Tests HOSPITAL", () => {
  //GET TESTS
  test("GET das estatísticas de um hospital", async () => {
    const response = await supertest(app).get(
      "/api/v1/hospital/1/statistics/ratings"
    );

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("ratingsStatistics");
    expect(response.body.ratingsStatistics).toBeInstanceOf(Object);
  });

  test("GET de um hospital que existe", async () => {
    const response = await supertest(app).get("/api/v1/hospital-data/1");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("hospital");
    expect(response.body).toHaveProperty("address");
    expect(response.body.hospital).toBeInstanceOf(Object);
    expect(response.body.address).toBeInstanceOf(Object);
  });

  test("GET de um hospital que não existe", async () => {
    const response = await supertest(app).get("/api/v1/hospital-data/100");

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });

  test("GET de todos hospitais", async () => {
    const response = await supertest(app).get("/api/v1/hospitals");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("hospitals");
    expect(response.body.hospitals).toBeInstanceOf(Array);
  });

  test("GET dos agendamentos feitos no hospital quando existem", async () => {
    const response = await supertest(app).get("/api/v1/hospital/1/schedules");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("schedules");
    expect(response.body.schedules).toBeInstanceOf(Array);
  });

  test("GET dos agendamentos feitos no hospital quando não existem", async () => {
    const response = await supertest(app).get("/api/v1/hospital/100/schedules");

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });

  //Ver quando o nao tem um hospital
  test("GET das estatísticas do hospital sobre agendamentos", async () => {
    const response = await supertest(app).get(
      "/api/v1/hospital/1/statistics/schedules"
    );

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("schedulesStatistics");
    expect(response.body.schedulesStatistics).toBeInstanceOf(Object);
  });

  test("GET das estatísticas do hospital sobre avaliações quando o hospital existe", async () => {
    const response = await supertest(app).get(
      "/api/v1/hospital/1/statistics/reviews"
    );

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("reviewsStatistics");
    expect(response.body.reviewsStatistics).toBeInstanceOf(Array);
  });

  test("GET das estatísticas do hospital sobre avaliações quando o hospital não existe", async () => {
    const response = await supertest(app).get(
      "/api/v1/hospital/100/statistics/reviews"
    );

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });

  // VER ESSA PARTE PARA VER COMO QUE FAZ QUANDO NAO TEM NENHUM
  test("GET de todos os hospitais quando não tem nenhum", async () => {
    const response = await supertest(app).get("/api/v1/hospital-data/100");

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });

  // POSTS TESTS
  test("POST do hospital com dados corretos", async () => {
    const data = {
      hospital: {
        name: "Hospital de Jandira",
        cnpj: "3454643445456",
        email: "hospitaljandira@gmail.com",
        phone: "1111-1111",
        website: "www.hospitaljandira.com.br",
        donationSite: "www.hospitaljandira.com.br",
        otherDonationSite: "www.hospitaljandira.com.br",
        photo:
          "https://www.folhadejandira.com.br/wp-content/uploads/2023/02/20230203-hospital-de-jandira-03-e1675468680181.jpg",
        password: "123",
      },
      address: {
        cep: "04216900",
        uf: "SP",
        city: "Jandira",
        neighborhood: "Ipiranga",
        street: "Rua Mil Oitocentos e Vinte e Dois",
        number: "76",
        complement: "Hospital",
      },
    };

    const response = await supertest(app)
      .post(`${BASE_URL}/hospital-registration`)
      .send(data)
      .expect(201);

    expect(response.body.message).toBe("Record created successfully.");
  });

  test("POST do hospital com dados incorretos", async () => {
    const data = {
      hospital: {
        name: "Hospital de Jandira",
        //CNPJ too long
        cnpj: "3454643445456232332424",
        email: "hospitaljandira@gmail.com",
        phone: "1111-1111",
        website: "www.hospitaljandira.com.br",
        donationSite: "www.hospitaljandira.com.br",
        otherDonationSite: "www.hospitaljandira.com.br",
        photo:
          "https://www.folhadejandira.com.br/wp-content/uploads/2023/02/20230203-hospital-de-jandira-03-e1675468680181.jpg",
        password: "123",
      },
      address: {
        cep: "04216900",
        uf: "SP",
        city: "Jandira",
        neighborhood: "Ipiranga",
        street: "Rua Mil Oitocentos e Vinte e Dois",
        number: "76",
        complement: "Hospital",
      },
    };

    const response = await supertest(app)
      .post(`${BASE_URL}/hospital-registration`)
      .send(data)
      .expect(400);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe(
      "There are mandatory data that have not been filled in."
    );
  });

  test("POST login do hospital com dados corretos", async () => {
    const data = {
      email: "hospitaljandira@gmail.com",
      password: "123",
    };

    const response = await supertest(app)
      .post(`${BASE_URL}/hospital-login`)
      .send(data)
      .expect(200);

    expect(response.body).toHaveProperty("hospitalData");
    expect(response.body.hospitalData).toBeInstanceOf(Object);
  });

  test("POST login do hospital com dados incorretos", async () => {
    const data = {
      email: "sofiaaaa@gmail.com",
      password: "123567",
    };

    const response = await supertest(app)
      .post(`${BASE_URL}/hospital-login`)
      .send(data)
      .expect(404);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("User or password incorrects.");
  });

  // PUT TESTS
  test("PUT do hospital com dados corretos", async () => {
    const data = {
      id: 1,
      hospital: {
        name: "Sofia Coghi Landi",
        cnpj: "123453-34.09",
        email: "sofiacoghi@gmail.com",
        phone: "(11) 1111-1111",
        website: "www.sofia.com.br",
        donationSite: "Local 1",
        otherDonationSite: "Local 2",
        photo: "Imagem URL",
        password: "123",
      },
      address: {
        cep: "0922-844",
        uf: "SP",
        city: "São Paulo",
        neighborhood: "carapicuiba",
        street: "Rua Sofia",
        number: "222",
        complement: "",
      },
    };

    const response = await supertest(app)
      .put(`${BASE_URL}/hospital-update`)
      .send(data)
      .expect(204);

    expect(response.body).toStrictEqual({});
  });

  test("PUT do hospital com dados incorretos", async () => {
    const data = {
      id: 1,
      hospital: {
        name: "Sofia Coghi Landi",
        cnpj: "123453-34.09",
        email: "sofiacoghi@gmail.com",
        //Phone too long
        phone: "(11) 1111-1111111111111",
        website: "www.sofia.com.br",
        donationSite: "Local 1",
        otherDonationSite: "Local 2",
        photo: "Imagem URL",
        password: "123",
      },
      address: {
        cep: "0922-844",
        uf: "SP",
        city: "São Paulo",
        neighborhood: "carapicuiba",
        street: "Rua Sofia",
        number: "222",
        complement: "",
      },
    };

    const response = await supertest(app)
      .put(`${BASE_URL}/hospital-update`)
      .send(data)
      .expect(400);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe(
      "There are mandatory data that have not been filled in."
    );
  });

  test("PUT de um hospital que não existe", async () => {
    const data = {
      id: 100,
      hospital: {
        name: "Sofia Coghi Landi",
        cnpj: "123453-34.09",
        email: "sofiacoghi@gmail.com",
        phone: "(11) 1111-1111",
        website: "www.sofia.com.br",
        donationSite: "Local 1",
        otherDonationSite: "Local 2",
        photo: "Imagem URL",
        password: "123",
      },
      address: {
        cep: "0922-844",
        uf: "SP",
        city: "São Paulo",
        neighborhood: "carapicuiba",
        street: "Rua Sofia",
        number: "222",
        complement: "",
      },
    };

    const response = await supertest(app)
      .put(`${BASE_URL}/hospital-update`)
      .send(data)
      .expect(404);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("No items found.");
  });

  test("PUT da senha do hospital que existe", async () => {
    const data = {
      id: 1,
      password: "123",
    };

    const response = await supertest(app)
      .put(`${BASE_URL}/hospital/redefine-password`)
      .send(data)
      .expect(204);

    expect(response.body).toStrictEqual({});
  });

  test("PUT da senha do hospital que não existe", async () => {
    const data = {
      id: 100,
      password: "123",
    };

    const response = await supertest(app)
      .put(`${BASE_URL}/hospital/redefine-password`)
      .send(data)
      .expect(404);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("No items found.");
  });

  //DELETE TESTS
  //   test("DELETE de um hospital que existe", async () => {
  //     const response = await supertest(app)
  //       .delete(`${BASE_URL}/delete-hospital/1`)
  //       .expect(204);

  //     expect(response.body).toStrictEqual({});
  //   });

  //   test("DELETE de um hospital que não existe", async () => {
  //     const response = await supertest(app)
  //       .delete(`${BASE_URL}/delete-hospital/100`)
  //       .expect(404);

  //     expect(response.body).toHaveProperty("message");
  //     expect(response.body.message).toBe("No items found.");
  //   });
});

// SCHEDULE TESTS
describe("Integration Tests SCHEDULE", () => {
  //   GET TESTS
  test("GET de todos os agendamentos", async () => {
    const response = await supertest(app).get(`${BASE_URL}/schedules`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("schedules");
    expect(response.body.schedules).toBeInstanceOf(Array);
  });

  //   test("GET de todos os agendamentos quando não há nenhum", async () => {
  //     const response = await supertest(app).get(`${BASE_URL}/schedules`);

  //     expect(response.status).toBe(404);
  //     expect(response.body).toHaveProperty("message");
  //     expect(response.body.message).toBe("No items found.");
  //   });

  //POST TESTS
  test("POST do agendamento com dados corretos", async () => {
    const data = [
      {
        date: "03/07/2000",
        hour: "14:30",
        hospitalSiteId: 1,
      },
      {
        date: "19/01/1845",
        hour: "07:12",
        hospitalSiteId: 1,
      },
    ];

    const response = await supertest(app)
      .post(`${BASE_URL}/book-schedules`)
      .send(data)
      .expect(201);

    expect(response.body.message).toBe("Record created successfully.");
  });

  //PUT TESTS
  test("PUT do agendamento para PENDING", async () => {
    const data = {
      id: 1,
      observation: "Sofia Linda Melhor Filha Te Amo",
    };

    const response = await supertest(app)
      .put(`${BASE_URL}/schedule-cancel`)
      .send(data)
      .expect(204);

    expect(response.body).toStrictEqual({});
  });

  test("PUT do agendamento para PENDING quando os dados estão errados", async () => {
    const data = {
      id: 1,
      observation: 123,
    };

    const response = await supertest(app)
      .put(`${BASE_URL}/schedule-cancel`)
      .send(data)
      .expect(400);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe(
      "There are mandatory data that have not been filled in."
    );
  });

  test("PUT do agendamento para PENDING quando não existe", async () => {
    const data = {
      id: 100,
      observation: "Sofia Linda Melhor Filha Te Amo",
    };

    const response = await supertest(app)
      .put(`${BASE_URL}/schedule-cancel`)
      .send(data)
      .expect(404);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("No items found.");
  });

  test("PUT do agendamento para RESCHEDULED", async () => {
    const data = {
      id: 1,
      date: "20/03/2000",
      hour: "12:00",
      siteId: 1,
    };

    const response = await supertest(app)
      .put(`${BASE_URL}/schedule-reschedule`)
      .send(data)
      .expect(204);

    expect(response.body).toStrictEqual({});
  });

  test("PUT do agendamento para RESCHEDULED quando os dados estão errados", async () => {
    const data = {
      id: 1,
      date: "20/03/200022",
      hour: "12:00",
      siteId: 1,
    };

    const response = await supertest(app)
      .put(`${BASE_URL}/schedule-reschedule`)
      .send(data)
      .expect(400);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe(
      "There are mandatory data that have not been filled in."
    );
  });

  test("PUT do agendamento para RESCHEDULED quando não existe", async () => {
    const data = {
      id: 100,
      date: "20/03/2000",
      hour: "12:00",
      siteId: 2,
    };

    const response = await supertest(app)
      .put(`${BASE_URL}/schedule-reschedule`)
      .send(data)
      .expect(404);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("No items found.");
  });

  test("PUT do agendamento para CONCLUDED", async () => {
    const data = {
      id: 1,
    };

    const response = await supertest(app)
      .put(`${BASE_URL}/schedule-conclude`)
      .send(data)
      .expect(204);

    expect(response.body).toStrictEqual({});
  });

  test("PUT do agendamento para CONCLUDED quando não existe", async () => {
    const data = {
      id: 100,
    };

    const response = await supertest(app)
      .put(`${BASE_URL}/schedule-conclude`)
      .send(data)
      .expect(404);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("No items found.");
  });
});

// SCHEDULE-STATUS TESTS
describe("Integration Tests SCHEDULE-STATUS", () => {
  //POST TESTS
  test("POST do agendamento do usuário com dados corretos", async () => {
    const data = {
      observation: "",
      status: "SCHEDULED",
      idSchedule: 1,
    };

    const response = await supertest(app)
      .post(`${BASE_URL}/schedule-status`)
      .send(data)
      .expect(201);

    expect(response.body.message).toBe("Record created successfully.");
  });

  test("POST do agendamento do usuário com dados incorretos", async () => {
    const data = {
      observation: 12354,
      idStatus: 1,
      idSchedule: 1,
    };

    const response = await supertest(app)
      .post(`${BASE_URL}/schedule-status`)
      .send(data)
      .expect(400);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe(
      "There are mandatory data that have not been filled in."
    );
  });
});

// SITE TESTS
describe("Integration Tests SITE", () => {
  //GET TESTS
  test("GET de todos os locais de agendamentos do hospital", async () => {
    const response = await supertest(app).get(`${BASE_URL}/hospital/1/sites`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("sites");
    expect(response.body.sites).toBeInstanceOf(Array);
  });

  test("GET de todos os locais de agendamentos do hospital que não existe", async () => {
    const response = await supertest(app).get(`${BASE_URL}/hospital/100/sites`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("No items found.");
  });
});

describe("Integration Tests BOOK-SCHEDULE", () => {
  //GET TESTS
  test("GET de todas as reservas de agendamentos do hospital", async () => {
    const response = await supertest(app).get(
      `${BASE_URL}/hospital/1/book-schedules`
    );

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("bookSchedules");
    expect(response.body.bookSchedules).toBeInstanceOf(Array);
  });

  test("GET de todas as reservas de agendamentos do hospital que não existe", async () => {
    const response = await supertest(app).get(
      `${BASE_URL}/hospital/100/book-schedules`
    );

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("No items found.");
  });

  //POST TESTS
  test("POST da reserva de agendamentos com dados corretos", async () => {
    const data = [
      {
        date: "03/07/2000",
        hour: "14:30",
        hospitalSiteId: 1,
      },
      {
        date: "19/01/1845",
        hour: "07:12",
        hospitalSiteId: 1,
      },
    ];

    const response = await supertest(app)
      .post(`${BASE_URL}/book-schedules`)
      .send(data)
      .expect(201);

    expect(response.body.message).toBe("Record created successfully.");
  });

  test("POST da reserva de agendamentos com dados incorretos", async () => {
    const data = [
      {
        date: "03/07/200023",
        hour: "14:30",
        hospitalSiteId: 1,
      },
      {
        date: "19/01/1845",
        hour: "07:12",
        hospitalSiteId: 1,
      },
    ];

    const response = await supertest(app)
      .post(`${BASE_URL}/book-schedules`)
      .send(data)
      .expect(400);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe(
      "There are mandatory data that have not been filled in."
    );
  });

  //PUT TESTS
  test("PUT da reserva de agendamentos com dados corretos", async () => {
    const data = {
      id: 1,
      date: "20/01/2000",
      hour: "10:20",
      siteId: 1,
    };

    const response = await supertest(app)
      .put(`${BASE_URL}/update-book-schedule`)
      .send(data)
      .expect(204);

    expect(response.body).toStrictEqual({});
  });

  test("PUT da reserva de agendamentos com dados incorretos", async () => {
    const data = {
      id: 1,
      date: "20/01/200023",
      hour: "10:20",
      siteId: 1,
    };

    const response = await supertest(app)
      .put(`${BASE_URL}/update-book-schedule`)
      .send(data)
      .expect(400);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe(
      "There are mandatory data that have not been filled in."
    );
  });

  //DELETE TESTS VER ESSE AQUI DEPOIS
  //   test("DELETE de uma reserva de agendamento que existe", async () => {
  //     const response = await supertest(app)
  //       .delete(`${BASE_URL}/delete-book-schedule/1`)
  //       .expect(204);

  //     expect(response.body).toStrictEqual({});
  //   });

  //   test("DELETE de uma reserva de agendamento que não existe", async () => {
  //     const response = await supertest(app)
  //       .delete(`${BASE_URL}/delete-book-schedule/100`)
  //       .expect(404);

  //     expect(response.body).toHaveProperty("message");
  //     expect(response.body.message).toBe("No items found.");
  //   });
});

describe("Integration Tests CAMPAIGN", () => {
  //GET TESTS
  test("GET das campanhas de um hospital que existe", async () => {
    const response = await supertest(app).get(
      `${BASE_URL}/hospital/1/campaigns`
    );

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("campaigns");
    expect(response.body.campaigns).toBeInstanceOf(Array);
  });

  test("GET das campanhas de um hospital que não existe", async () => {
    const response = await supertest(app).get(
      `${BASE_URL}/hospital/100/campaigns`
    );

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("No items found.");
  });

  //POST TESTS
  test("POST de campanha com dados corretos", async () => {
    const data = {
      date: "03/07/2000",
      hour: "14:30",
      description: "Loren Ipsun da description alo",
      image: "alooooo",
      hospitalId: 1,
    };

    const response = await supertest(app)
      .post(`${BASE_URL}/campaign`)
      .send(data)
      .expect(201);

    expect(response.body.message).toBe("Record created successfully.");
  });

  test("POST de campanha com dados incorretos", async () => {
    const data = {
      date: "03/07/200023",
      hour: "14:30",
      description: "Loren Ipsun da description alo",
      image: "alooooo",
      hospitalId: 1,
    };

    const response = await supertest(app)
      .post(`${BASE_URL}/campaign`)
      .send(data)
      .expect(400);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe(
      "There are mandatory data that have not been filled in."
    );
  });

  //PUT TESTS
  test("PUT de campanha com dados corretos", async () => {
    const data = {
      id: 1,
      date: "03/07/2000",
      hour: "14:30",
      description: "Loren Ipsun da description alo",
      image: "alooooo",
    };

    const response = await supertest(app)
      .put(`${BASE_URL}/update-campaign`)
      .send(data)
      .expect(204);

    expect(response.body).toStrictEqual({});
  });

  test("PUT de campanha com dados incorretos", async () => {
    const data = {
      id: 1,
      date: "03/07/2000234",
      hour: "14:30",
      description: "Loren Ipsun da description alo",
      image: "alooooo",
    };

    const response = await supertest(app)
      .put(`${BASE_URL}/update-campaign`)
      .send(data)
      .expect(400);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe(
      "There are mandatory data that have not been filled in."
    );
  });

  //DELETE TESTS VER ESSE AQUI DEPOIS
  //   test("DELETE de uma campanha que existe", async () => {
  //     const response = await supertest(app)
  //       .delete(`${BASE_URL}/delete-campaign/1`)
  //       .expect(204);

  //     expect(response.body).toStrictEqual({});
  //   });

  //   test("DELETE de uma camapanha que não existe", async () => {
  //     const response = await supertest(app)
  //       .delete(`${BASE_URL}/delete-campaign/100`)
  //       .expect(404);

  //     expect(response.body).toHaveProperty("message");
  //     expect(response.body.message).toBe("No items found.");
  //   });
});

describe("Integration Tests DONATION BANK", () => {
  //GET TESTS
  test("GET do banco de sangue de um hospital que existe", async () => {
    const response = await supertest(app).get(
      `${BASE_URL}/hospital/1/donation-banks`
    );

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("donationBanks");
    expect(response.body.donationBanks).toBeInstanceOf(Array);
  });

  test("GET do banco de sangue de um hospital que não existe", async () => {
    const response = await supertest(app).get(
      `${BASE_URL}/hospital/100/donation-banks`
    );

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("No items found.");
  });

  //POST TESTS
  test("POST do banco de sangue com dados corretos", async () => {
    const data = {
      year: 2023,
      bloodMl: 350,
      bloodType: "A-",
      hospitalId: 1,
    };

    const response = await supertest(app)
      .post(`${BASE_URL}/donation-bank`)
      .send(data)
      .expect(201);

    expect(response.body.message).toBe("Record created successfully.");
  });

  test("POST do banco de sangue com dados incorretos", async () => {
    const data = {
      year: 2023,
      bloodMl: 350,
      bloodType: 4423,
      hospitalId: 1,
    };

    const response = await supertest(app)
      .post(`${BASE_URL}/donation-bank`)
      .send(data)
      .expect(400);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe(
      "There are mandatory data that have not been filled in."
    );
  });

  //PUT TESTS
  test("PUT do banco de sangue com dados corretos", async () => {
    const data = {
      id: 1,
      year: 2023,
      bloodMl: 350,
      bloodType: "A+",
      hospitalId: 1,
    };

    const response = await supertest(app)
      .put(`${BASE_URL}/update-donation-bank`)
      .send(data)
      .expect(204);

    expect(response.body).toStrictEqual({});
  });

  test("PUT  do banco de sangue com dados incorretos", async () => {
    const data = {
      id: 1,
      year: 2023,
      bloodMl: 350,
      bloodType: 4423,
      hospitalId: 1,
    };

    const response = await supertest(app)
      .put(`${BASE_URL}/update-donation-bank`)
      .send(data)
      .expect(400);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe(
      "There are mandatory data that have not been filled in."
    );
  });
});

describe("Integration Tests REVIEW", () => {
  //POST TESTS
  test("POST da opinião com dados corretos", async () => {
    const data = {
      opinion:
        "Ótimo atendimento, exelentes profissionais e instalações extrmamente limpos e seguro",
      idUser: 1,
      idHospital: 1,
      idStar: 5,
    };

    const response = await supertest(app)
      .post(`${BASE_URL}/review-registration`)
      .send(data)
      .expect(201);

    expect(response.body.message).toBe("Record created successfully.");
  });

  test("POST da opinião com dados incorretos", async () => {
    const data = {
      opinion: 33123,
      idUser: 1,
      idHospital: 1,
      idStar: 5,
    };

    const response = await supertest(app)
      .post(`${BASE_URL}/review-registration`)
      .send(data)
      .expect(400);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe(
      "There are mandatory data that have not been filled in."
    );
  });
});

describe("Integration Tests USER", () => {
  //GET TESTS
  test("GET dos agendamentos de um usuário que existe", async () => {
    const response = await supertest(app).get(`${BASE_URL}/users/1/schedules`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("schedules");
    expect(response.body.schedules).toBeInstanceOf(Array);
  });

  test("GET dos agendamentos de um usuário que não existe", async () => {
    const response = await supertest(app).get(
      `${BASE_URL}/users/100/schedules`
    );

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("No items found.");
  });

  test("GET de um usuário que existe", async () => {
    const response = await supertest(app).get(`${BASE_URL}/users/1`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("user");
    expect(response.body.user).toBeInstanceOf(Object);
  });

  test("GET de um usuário que não existe", async () => {
    const response = await supertest(app).get(`${BASE_URL}/users/100`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("No items found.");
  });

  //POST TESTS
  test("POST de um usuário com dados corretos", async () => {
    const data = {
      user: {
        name: "Teste de Delete",
        cpf: "1225.324-32",
        email: "caio@gmail.com",
        phone: "12110988",
        dateOfBirth: "21/03/1999",
        weight: 70.02,
        photo:
          "https://conteudo.imguol.com.br/c/esporte/62/2022/10/26/cristiano-ronaldo-em-acao-com-a-camisa-da-selecao-de-portugal-1666822687434_v2_4x3.jpg",
        password: "123",
        sex: "Masculine",
        bloodType: "A+",
      },
      address: {
        cep: "06423224",
        uf: "SP",
        city: "JANDIRA",
        neighborhood: "Brotinho",
        street: "Rua do brotinho",
        number: "85",
        complement: "Casa",
      },
    };

    const response = await supertest(app)
      .post(`${BASE_URL}/user-registration`)
      .send(data)
      .expect(201);

    expect(response.body.message).toBe("Record created successfully.");
  });

  test("POST de um usuário com dados incorretos", async () => {
    const data = {
      user: {
        name: "Teste de Delete",
        cpf: "1225.324-32",
        email: "delete@gmail.com",
        phone: "121109883243243242",
        dateOfBirth: "21/03/1999324",
        weight: 70.02,
        photo:
          "https://conteudo.imguol.com.br/c/esporte/62/2022/10/26/cristiano-ronaldo-em-acao-com-a-camisa-da-selecao-de-portugal-1666822687434_v2_4x3.jpg",
        password: "1234",
        sex: "Masculine",
        bloodType: "A+",
      },
      address: {
        cep: "06423224",
        uf: "SP",
        city: "JANDIRA",
        neighborhood: "Brotinho",
        street: "Rua do brotinho",
        number: "85",
        complement: "Casa",
      },
    };

    const response = await supertest(app)
      .post(`${BASE_URL}/user-registration`)
      .send(data)
      .expect(400);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe(
      "There are mandatory data that have not been filled in."
    );
  });

  test("POST login do usuário com dados corretos", async () => {
    const data = {
      email: "caio@gmail.com",
      password: "123",
    };

    const response = await supertest(app)
      .post(`${BASE_URL}/user-login`)
      .send(data)
      .expect(200);

    expect(response.body).toHaveProperty("userData");
    expect(response.body.userData).toBeInstanceOf(Object);
  });

  test("POST login do usuário com dados incorretos", async () => {
    const data = {
      email: "sofiaaaa@gmail.com",
      password: "123567",
    };

    const response = await supertest(app)
      .post(`${BASE_URL}/user-login`)
      .send(data)
      .expect(404);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("User or password incorrects.");
  });

  //    PUT TESTS
  test("PUT de um usuário com dados corretos", async () => {
    const data = {
      id: 1,
      user: {
        name: "Cristiano Ronaldo",
        cpf: "1225.324-32",
        email: "cr7@gmail.com",
        phone: "1968744707",
        dateOfBirth: "21/03/1999",
        weight: 70.02,
        photo:
          "https://conteudo.imguol.com.br/c/esporte/62/2022/10/26/cristiano-ronaldo-em-acao-com-a-camisa-da-selecao-de-portugal-1666822687434_v2_4x3.jpg",
        password: "1234",
        sex: "Masculine",
        bloodType: "A+",
      },
      address: {
        cep: "22222222",
        uf: "SP",
        city: "ITAPEVI",
        neighborhood: "Brotinho",
        street: "Rua dos Craques",
        number: "85",
        complement: "Casa da Lenda",
      },
    };

    const response = await supertest(app)
      .put(`${BASE_URL}/user-update`)
      .send(data)
      .expect(204);

    expect(response.body).toStrictEqual({});
  });

  test("PUT de um usuário com dados incorretos", async () => {
    const data = {
      id: 1,
      user: {
        name: "Cristiano Ronaldo",
        cpf: "1225.324-32",
        email: "cr7@gmail.com",
        phone: "1968744707423424",
        dateOfBirth: "21/03/1999223",
        weight: 70.02,
        photo:
          "https://conteudo.imguol.com.br/c/esporte/62/2022/10/26/cristiano-ronaldo-em-acao-com-a-camisa-da-selecao-de-portugal-1666822687434_v2_4x3.jpg",
        password: "1234",
        sex: "Masculine",
        bloodType: "A+",
      },
      address: {
        cep: "22222222",
        uf: "SP",
        city: "ITAPEVI",
        neighborhood: "Brotinho",
        street: "Rua dos Craques",
        number: "85",
        complement: "Casa da Lenda",
      },
    };

    const response = await supertest(app)
      .put(`${BASE_URL}/user-update`)
      .send(data)
      .expect(400);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe(
      "There are mandatory data that have not been filled in."
    );
  });

  test("PUT da senha do usuário que existe", async () => {
    const data = {
      id: 1,
      password: "123",
    };

    const response = await supertest(app)
      .put(`${BASE_URL}/user/redefine-password`)
      .send(data)
      .expect(204);

    expect(response.body).toStrictEqual({});
  });

  test("PUT da senha do usuário que não existe", async () => {
    const data = {
      id: 100,
      password: "123",
    };

    const response = await supertest(app)
      .put(`${BASE_URL}/user/redefine-password`)
      .send(data)
      .expect(404);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("No items found.");
  });

  //    DELETE TESTS VER DEPOIS
  //   test("DELETE de um usuário que existe", async () => {
  //     const response = await supertest(app)
  //       .delete(`${BASE_URL}/delete-user/1`)
  //       .expect(204);

  //     expect(response.body).toStrictEqual({});
  //   });

  //   test("DELETE de um usuário que não existe", async () => {
  //     const response = await supertest(app)
  //       .delete(`${BASE_URL}/delete-user/100`)
  //       .expect(404);

  //     expect(response.body).toHaveProperty("message");
  //     expect(response.body.message).toBe("No items found.");
  //   });
});

/* --------------------------------- UNITARY TESTS ---------------------------------*/
describe("Unitary Tests USER", () => {
  test("loginUser with correct data", async () => {
    const data = {
      email: "sofia@gmail.com",
      password: "1234",
    };

    const response = await userController.loginUser(data);

    expect(response.status).toBe(200);
    expect(response.userData.id).toBeGreaterThan(0);
    expect(response.userData.email).toBe("sofia@gmail.com");
    expect(typeof response.userData.token).toBe("string");
  });

  test("loginUser with incorrect data", async () => {
    const data = {
      email: 3124,
      password: "1234",
    };

    const response = await userController.loginUser(data);

    expect(response.status).toBe(400);
    expect(response.message).toBe(
      "There are mandatory data that have not been filled in."
    );
  });

  test("loginUser with nonexistent user", async () => {
    const data = {
      email: "sofiafwefewfwefw@gmail.com",
      password: "12342345",
    };

    const response = await userController.loginUser(data);

    expect(response.status).toBe(404);
    expect(response.message).toBe("User or password incorrects.");
  });

  test("userInsert with correct data", async () => {
    const data = {
      user: {
        name: "Solange Ribeiro",
        cpf: "1225.324-32",
        email: "sofia@gmail.com",
        phone: "11982763467",
        dateOfBirth: "21/09/1989",
        weight: 62.02,
        photo: "qqdqwdwqdqw",
        password: "1234",
        sex: "Feminine",
        bloodType: "A+",
      },
      address: {
        cep: "06423224",
        uf: "SP",
        city: "JANDIRA",
        neighborhood: "Brotinho",
        street: "Rua do brotinho",
        number: "85",
        complement: "Casa",
      },
    };

    const response = await userController.userInsert(data);

    expect(response.status).toBe(201);
    expect(response.message).toBe("Record created successfully.");
  });

  test("userInsert with incorrect data", async () => {
    const data = {
      user: {
        name: "Solange Ribeiro",
        cpf: "1225.324-32",
        email: "sofia@gmail.com",
        phone: "1198276346732342342342342", //Incorrect Phone
        dateOfBirth: "21/09/1989",
        weight: 62.02,
        photo: "qqdqwdwqdqw",
        password: "1234",
        sex: "Feminine",
        bloodType: "A+",
      },
      address: {
        cep: "06423224",
        uf: "SP",
        city: "JANDIRA",
        neighborhood: "Brotinho",
        street: "Rua do brotinho",
        number: "85",
        complement: "Casa",
      },
    };

    const response = await userController.userInsert(data);

    expect(response.status).toBe(400);
    expect(response.message).toBe(
      "There are mandatory data that have not been filled in."
    );
  });

  test("userGet with existent user", async () => {
    const data = 1;

    const response = await userController.userGet(data);

    expect(response.status).toBe(200);
    expect(response).toHaveProperty("user");
    expect(response.user).toBeInstanceOf(Object);
    expect(response).toHaveProperty("address");
    expect(response.address).toBeInstanceOf(Object);
  });

  test("userGet with nonexistent user", async () => {
    const data = 100;

    const response = await userController.userGet(data);

    expect(response.status).toBe(404);
    expect(response.message).toBe("No items found.");
  });

  test("userUpdate with correct data", async () => {
    const id = 1;
    const data = {
      user: {
        name: "Cristiano Ronaldo",
        cpf: "1225.324-32",
        email: "cr7@gmail.com",
        phone: "1968744707",
        dateOfBirth: "21/03/1999",
        weight: 70.02,
        photo:
          "https://conteudo.imguol.com.br/c/esporte/62/2022/10/26/cristiano-ronaldo-em-acao-com-a-camisa-da-selecao-de-portugal-1666822687434_v2_4x3.jpg",
        password: "1234",
        sex: "Masculine",
        bloodType: "A+",
      },
      address: {
        cep: "22222222",
        uf: "SP",
        city: "ITAPEVI",
        neighborhood: "Brotinho",
        street: "Rua dos Craques",
        number: "85",
        complement: "Casa da Lenda",
      },
    };

    const response = await userController.userUpdate(id, data);

    expect(response.status).toBe(204);
    expect(response.message).toBe("Record updated successfully.");
  });

  test("userUpdate with incorrect data", async () => {
    const id = 1;
    const data = {
      user: {
        name: "Cristiano Ronaldo",
        cpf: "1225.324-32",
        email: "cr7@gmail.com",
        phone: "196874470732432423", //Incorrect Phone
        dateOfBirth: "21/03/1999",
        weight: 70.02,
        photo:
          "https://conteudo.imguol.com.br/c/esporte/62/2022/10/26/cristiano-ronaldo-em-acao-com-a-camisa-da-selecao-de-portugal-1666822687434_v2_4x3.jpg",
        password: "1234",
        sex: "Masculine",
        bloodType: "A+",
      },
      address: {
        cep: "22222222",
        uf: "SP",
        city: "ITAPEVI",
        neighborhood: "Brotinho",
        street: "Rua dos Craques",
        number: "85",
        complement: "Casa da Lenda",
      },
    };

    const response = await userController.userUpdate(id, data);

    expect(response.status).toBe(400);
    expect(response.message).toBe(
      "There are mandatory data that have not been filled in."
    );
  });

  test("userUpdate with unexistent user", async () => {
    const id = 100;
    const data = {
      user: {
        name: "Cristiano Ronaldo",
        cpf: "1225.324-32",
        email: "cr7@gmail.com",
        phone: "1968744707",
        dateOfBirth: "21/03/1999",
        weight: 70.02,
        photo:
          "https://conteudo.imguol.com.br/c/esporte/62/2022/10/26/cristiano-ronaldo-em-acao-com-a-camisa-da-selecao-de-portugal-1666822687434_v2_4x3.jpg",
        password: "1234",
        sex: "Masculine",
        bloodType: "A+",
      },
      address: {
        cep: "06423224",
        uf: "SP",
        city: "JANDIRA",
        neighborhood: "Brotinho",
        street: "Rua do brotinho",
        number: "85",
        complement: "Casa",
      },
    };

    const response = await userController.userUpdate(id, data);

    expect(response.status).toBe(404);
    expect(response.message).toBe("No items found.");
  });

  test("userPasswordUpdate with correct data", async () => {
    const id = 1;
    const data = {
      password: "1234",
    };

    const response = await userController.userPasswordUpdate(id, data);

    expect(response.status).toBe(204);
    expect(response.message).toBe("Record updated successfully.");
  });

  test("userPasswordUpdate with unexistent user", async () => {
    const id = 100;
    const data = {
      password: "1234",
    };

    const response = await userController.userPasswordUpdate(id, data);

    expect(response.status).toBe(404);
    expect(response.message).toBe("No items found.");
  });
});

describe("Unitary Tests HOSPITAL", () => {
  test("loginHospital with existent hospital", async () => {
    const data = {
      email: "sofia@gmail.com",
      password: "1234",
    };

    const response = await hospitalController.loginHospital(data);

    expect(response.status).toBe(200);
    expect(response).toHaveProperty("hospitalData");
    expect(response.hospitalData).toBeInstanceOf(Object);
  });

  test("loginHospital with unexistent hospital", async () => {
    const data = {
      email: "sofiaaaaa@gmail.com",
      password: "1234",
    };

    const response = await hospitalController.loginHospital(data);

    expect(response.status).toBe(404);
    expect(response.message).toBe("User or password incorrects.");
  });

  test("loginHospital with wrong data", async () => {
    const data = {
      email: 423423,
      password: "1234",
    };

    const response = await hospitalController.loginHospital(data);

    expect(response.status).toBe(400);
    expect(response.message).toBe(
      "There are mandatory data that have not been filled in."
    );
  });

  test("hospitalInsert with correct data", async () => {
    const data = {
      hospital: {
        name: "Hospital de Jandira",
        cnpj: "3454643445456",
        email: "sofia@gmail.com",
        phone: "1111-1111",
        website: "www.hospitaljandira.com.br",
        donationSite: "Local 1",
        otherDonationSite: "Local 2",
        photo:
          "https://www.folhadejandira.com.br/wp-content/uploads/2023/02/20230203-hospital-de-jandira-03-e1675468680181.jpg",
        password: "1234",
      },
      address: {
        cep: "06600025",
        uf: "SP",
        city: "Jandira",
        neighborhood: "Jandira",
        street: "Rua do Oratório",
        number: "215",
        complement: "Hospital",
      },
    };

    const response = await hospitalController.hospitalInsert(data);

    expect(response.status).toBe(201);
    expect(response.message).toBe("Record created successfully.");
  });

  test("hospitalInsert with incorrect data", async () => {
    const data = {
      hospital: {
        name: "Hospital de Jandira",
        //CNPJ too long
        cnpj: "3454643445456232332424",
        email: "hospitaljandira@gmail.com",
        phone: "1111-1111",
        website: "www.hospitaljandira.com.br",
        donationSite: "www.hospitaljandira.com.br",
        otherDonationSite: "www.hospitaljandira.com.br",
        photo:
          "https://www.folhadejandira.com.br/wp-content/uploads/2023/02/20230203-hospital-de-jandira-03-e1675468680181.jpg",
        password: "123",
      },
      address: {
        cep: "04216900",
        uf: "SP",
        city: "Jandira",
        neighborhood: "Ipiranga",
        street: "Rua Mil Oitocentos e Vinte e Dois",
        number: "76",
        complement: "Hospital",
      },
    };

    const response = await hospitalController.hospitalInsert(data);

    expect(response.status).toBe(400);
    expect(response).toHaveProperty("message");
    expect(response.message).toBe(
      "There are mandatory data that have not been filled in."
    );
  });

  test("hospitalGet with existent hospital", async () => {
    const response = await hospitalController.hospitalGet(1);

    expect(response.status).toBe(200);
    expect(response).toHaveProperty("hospital");
    expect(response).toHaveProperty("address");
    expect(response.hospital).toBeInstanceOf(Object);
    expect(response.address).toBeInstanceOf(Object);
  });

  test("hospitalGet with unexistent hospital", async () => {
    const response = await hospitalController.hospitalGet(100);

    expect(response.status).toBe(404);
    expect(response).toHaveProperty("message");
  });

  test("hospitalGetSchedules with data", async () => {
    const response = await hospitalController.hospitalGetSchedules(1);

    expect(response.status).toBe(200);
    expect(response).toHaveProperty("schedules");
    expect(response.schedules).toBeInstanceOf(Array);
  });

  test("hospitalGetSchedules without data", async () => {
    const response = await hospitalController.hospitalGetSchedules(100);

    expect(response.status).toBe(404);
    expect(response).toHaveProperty("message");
  });

  test("hospitalUpdate with correct data", async () => {
    const data = {
      hospital: {
        name: "Sofia Coghi Landi",
        cnpj: "123453-34.09",
        email: "sofiacoghi@gmail.com",
        phone: "(11) 1111-1111",
        website: "www.sofia.com.br",
        donationSite: "Local 1",
        otherDonationSite: "Local 2",
        photo: "Imagem URL",
        password: "123",
      },
      address: {
        cep: "0922-844",
        uf: "SP",
        city: "São Paulo",
        neighborhood: "carapicuiba",
        street: "Rua Sofia",
        number: "222",
        complement: "",
      },
    };

    const response = await hospitalController.hospitalUpdate(1, data);

    expect(response.status).toBe(204);
  });

  test("hospitalUpdate with incorrect data", async () => {
    const data = {
      hospital: {
        name: "Sofia Coghi Landi",
        cnpj: "123453-34.09",
        email: "sofiacoghi@gmail.com",
        //Phone too long
        phone: "(11) 1111-1111111111111",
        website: "www.sofia.com.br",
        donationSite: "Local 1",
        otherDonationSite: "Local 2",
        photo: "Imagem URL",
        password: "123",
      },
      address: {
        cep: "0922-844",
        uf: "SP",
        city: "São Paulo",
        neighborhood: "carapicuiba",
        street: "Rua Sofia",
        number: "222",
        complement: "",
      },
    };

    const response = await hospitalController.hospitalUpdate(1, data);

    expect(response.status).toBe(400);
    expect(response).toHaveProperty("message");
    expect(response.message).toBe(
      "There are mandatory data that have not been filled in."
    );
  });

  test("hospitalUpdate of unexistent hospital", async () => {
    const data = {
      id: 100,
      hospital: {
        name: "Sofia Coghi Landi",
        cnpj: "123453-34.09",
        email: "sofiacoghi@gmail.com",
        phone: "(11) 1111-1111",
        website: "www.sofia.com.br",
        donationSite: "Local 1",
        otherDonationSite: "Local 2",
        photo: "Imagem URL",
        password: "123",
      },
      address: {
        cep: "0922-844",
        uf: "SP",
        city: "São Paulo",
        neighborhood: "carapicuiba",
        street: "Rua Sofia",
        number: "222",
        complement: "",
      },
    };

    const response = await hospitalController.hospitalUpdate(100, data);

    expect(response.status).toBe(404);
    expect(response).toHaveProperty("message");
    expect(response.message).toBe("No items found.");
  });

  test("hospitalPasswordUpdate with correct data", async () => {
    const data = {
      password: "123",
    };

    const response = await hospitalController.hospitalPasswordUpdate(1, data);

    expect(response.status).toBe(204);

  });

  test("hospitalPasswordUpdate of unexistent hospital", async () => {
    const data = {
      password: "123",
    };

    const response = await hospitalController.hospitalPasswordUpdate(100, data);

    expect(response.status).toBe(404);
    expect(response).toHaveProperty("message");
    expect(response.message).toBe("No items found.");
  });

  test("hospitalsGet", async () => {
    const response = await hospitalController.hospitalsGet();

    expect(response.status).toBe(200);
    expect(response).toHaveProperty("hospitals");
    expect(response.hospitals).toBeInstanceOf(Array);
  });
});

describe("Unitary Tests SITE", () => {
  test("sitesGet", async () => {
    const response = await siteController.sitesGet(1);

    expect(response.status).toBe(200);
    expect(response).toHaveProperty("sites");
    expect(response.sites).toBeInstanceOf(Object);
  });
});

describe("Unitary Tests REVIEW", () => {
  test("reviewInsert with correct data", async () => {
    const data = {
      opinion:
        "Ótimo atendimento, exelentes profissionais e instalações extremamente limpas e seguras",
      idUser: 1,
      idHospital: 1,
      idStar: 5,
    };

    const response = await reviewController.reviewInsert(data);

    expect(response.status).toBe(201);
    expect(response.message).toBe("Record created successfully.");
  });

  test("reviewInsert with incorrect data", async () => {
    const data = {
      opinion: 23442,
      idUser: 1,
      idHospital: 1,
      idStar: 5,
    };

    const response = await reviewController.reviewInsert(data);

    expect(response.status).toBe(400);
    expect(response.message).toBe(
      "There are mandatory data that have not been filled in."
    );
  });

  test("ratingsStatisticsGet", async () => {
    const response = await reviewController.ratingsStatisticsGet(1);

    expect(response.status).toBe(200);
    expect(response).toHaveProperty("ratingsStatistics");
    expect(response.ratingsStatistics).toBeInstanceOf(Object);
  });

  test("reviewsStatisticsGet", async () => {
    const response = await reviewController.reviewsStatisticsGet(1);

    expect(response.status).toBe(200);
    expect(response).toHaveProperty("reviewsStatistics");
    expect(response.reviewsStatistics).toBeInstanceOf(Object);
  });
});

describe("Unitary Tests DONATION-BANK", () => {
  test("donationBankInsert with correct data", async () => {
    const data = {
      year: 2023,
      bloodMl: 350,
      bloodType: "A-",
      hospitalId: 1,
    };

    const response = await donationBankController.donationBankInsert(data);

    expect(response.status).toBe(201);
    expect(response.message).toBe("Record created successfully.");
  });

  test("donationBankInsert with incorrect data", async () => {
    const data = {
      year: "dawd",
      bloodMl: 350,
      bloodType: "A-",
      hospitalId: 1,
    };

    const response = await donationBankController.donationBankInsert(data);

    expect(response.status).toBe(400);
    expect(response.message).toBe(
      "There are mandatory data that have not been filled in."
    );
  });

  test("donationBanksGet with existent hospital", async () => {
    const response = await donationBankController.donationBanksGet(1);

    expect(response.status).toBe(200);
    expect(response).toHaveProperty("donationBanks");
    expect(response.donationBanks).toBeInstanceOf(Object);
  });

  test("donationBanksGet with unexistent hospital", async () => {
    const response = await donationBankController.donationBanksGet(100);

    expect(response.status).toBe(404);
    expect(response.message).toBe("No items found.");
  });

  test("donationBankUpdate with correct data", async () => {
    const data = {
      year: 2023,
      bloodMl: 350,
      bloodType: "A+",
      hospitalId: 1,
    };

    const response = await donationBankController.donationBankUpdate(data);

    expect(response.status).toBe(204);
  });

  test("donationBankUpdate with incorrect data", async () => {
    const data = {
      year: "fes",
      bloodMl: 350,
      bloodType: "A+",
      hospitalId: 1,
    };

    const response = await donationBankController.donationBankUpdate(data);

    expect(response.status).toBe(400);
    expect(response.message).toBe(
      "There are mandatory data that have not been filled in."
    );
  });
});

describe("Unitary Tests CAMPAIGN", () => {
  test("campaignInsert with correct data", async () => {
    const data = {
      date: "13/01/2024",
      hour: "14:30",
      description: "Campanha de Doacao de Sangue",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWiD1lvqficG2rIaApU7lzgb8GUZ3nm1OqZkoUgTCD&s",
      hospitalId: 1,
    };

    const response = await campaignController.campaignInsert(data);

    expect(response.status).toBe(201);
    expect(response.message).toBe("Record created successfully.");
  });

  test("campaignInsert with incorrect data", async () => {
    const data = {
      date: "13/01/2024543546", //Incorrect Date
      hour: "14:30",
      description: "Campanha de Doacao de Sangue",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWiD1lvqficG2rIaApU7lzgb8GUZ3nm1OqZkoUgTCD&s",
      hospitalId: 1,
    };

    const response = await campaignController.campaignInsert(data);

    expect(response.status).toBe(400);
    expect(response.message).toBe(
      "There are mandatory data that have not been filled in."
    );
  });

  test("campaignUpdate with correct data", async () => {
    const data = {
      date: "13/01/2024",
      hour: "14:30",
      description: "Campanha de Doacao de Sangue",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWiD1lvqficG2rIaApU7lzgb8GUZ3nm1OqZkoUgTCD&s",
      hospitalId: 1,
    };

    const response = await campaignController.campaignUpdate(1, data);

    expect(response.status).toBe(204);
    expect(response.message).toBe("Record updated successfully.");
  });

  test("campaignUpdate with incorrect data", async () => {
    const data = {
      date: "13/01/202424234", //Incorrect Date
      hour: "14:30",
      description: "Campanha de Doacao de Sangue",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWiD1lvqficG2rIaApU7lzgb8GUZ3nm1OqZkoUgTCD&s",
      hospitalId: 1,
    };

    const response = await campaignController.campaignUpdate(1, data);

    expect(response.status).toBe(400);
    expect(response.message).toBe(
      "There are mandatory data that have not been filled in."
    );
  });

  test("campaignUpdate with unexistent campaign", async () => {
    const data = {
      date: "13/01/2024",
      hour: "14:30",
      description: "Campanha de Doacao de Sangue",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWiD1lvqficG2rIaApU7lzgb8GUZ3nm1OqZkoUgTCD&s",
      hospitalId: 1,
    };

    const response = await campaignController.campaignUpdate(100, data);

    expect(response.status).toBe(404);
    expect(response.message).toBe("No items found.");
  });

  test("campaignsGet", async () => {
    const response = await campaignController.campaignsGet();

    expect(response.status).toBe(200);
    expect(response).toHaveProperty("campaigns");
    expect(response.campaigns).toBeInstanceOf(Array);
  });
});

describe("Unitary Tests BOOK-SCHEDULE", () => {
  test("bookScheduleInsert with correct data", async () => {
    const data = [
      {
        date: "03/12/2023",
        hour: "14:30",
        hospitalSiteId: 1,
      },
      {
        date: "01/01/2024",
        hour: "07:10",
        hospitalSiteId: 1,
      },
    ];

    const response = await bookScheduleController.bookScheduleInsert(data);

    expect(response.status).toBe(201);
    expect(response.message).toBe("Record created successfully.");
  });

  test("bookScheduleInsert with incorrect data", async () => {
    const data = [
      {
        date: "03/12/2023232323", //Incorrect Date
        hour: "14:30",
        hospitalSiteId: 1,
      },
      {
        date: "01/01/2024",
        hour: "07:10",
        hospitalSiteId: 1,
      },
    ];

    const response = await bookScheduleController.bookScheduleInsert(data);

    expect(response.status).toBe(400);
    expect(response.message).toBe(
      "There are mandatory data that have not been filled in."
    );
  });

  test("bookSchedulesGet with existent hospital", async () => {
    const response = await bookScheduleController.bookSchedulesGet(1);

    expect(response.status).toBe(200);
    expect(response).toHaveProperty("bookSchedules");
    expect(response.bookSchedules).toBeInstanceOf(Object);
  });

  test("bookSchedulesGet with unexistent hospital", async () => {
    const response = await bookScheduleController.bookSchedulesGet(100);

    expect(response.status).toBe(404);
    expect(response).toHaveProperty("message");
    expect(response.message).toBe("No items found.");
  });

  test("bookScheduleUpdate with correct data", async () => {
    const data = {
      date: "20/01/2000",
      hour: "10:20",
      siteId: 1,
    };

    const response = await bookScheduleController.bookScheduleUpdate(1, data);

    expect(response.status).toBe(204);
  });

  test("bookScheduleUpdate with incorrect data", async () => {
    const data = {
      date: "20/01/200023423", //Incorrect Date
      hour: "10:20",
      siteId: 1,
    };

    const response = await bookScheduleController.bookScheduleUpdate(1, data);

    expect(response.status).toBe(400);
    expect(response.message).toBe(
      "There are mandatory data that have not been filled in."
    );
  });
});

describe("Unitary Tests SCHEDULE", () => {
  test("scheduleInsert with correct data", async () => {
    const data = {
      idUser: 1,
      idBookSchedule: 1,
    };

    const response = await scheduleController.scheduleInsert(data);

    expect(response.status).toBe(201);
    expect(response.message).toBe("Record created successfully.");
  });

  test("scheduleInsert with incorrect data", async () => {
    const data = {
      idUser: "efwe",
      idBookSchedule: 1,
    };

    const response = await scheduleController.scheduleInsert(data);

    expect(response.status).toBe(400);
    expect(response.message).toBe(
      "There are mandatory data that have not been filled in."
    );
  });

  test("scheduleCancelUpdate with correct data", async () => {
    const data = {
      observation: "Sofia Linda Melhor Filha Te Amo",
    };

    const response = await scheduleController.scheduleCancelUpdate(1, data);

    expect(response.status).toBe(204);
  });

  test("scheduleCancelUpdate with incorrect data", async () => {
    const data = {
      observation: 243423,
    };

    const response = await scheduleController.scheduleCancelUpdate(1, data);

    expect(response.status).toBe(400);
    expect(response.message).toBe(
      "There are mandatory data that have not been filled in."
    );
  });

  test("scheduleRescheduleUpdate with correct data", async () => {
    const data = {
      date: "20/03/2000",
      hour: "12:00",
      siteId: 2,
    };

    const response = await scheduleController.scheduleRescheduleUpdate(1, data);

    expect(response.status).toBe(204);
  });

  test("scheduleRescheduleUpdate with incorrect data", async () => {
    const data = {
      date: "20/03/200032131",
      hour: "12:00",
      siteId: 2,
    };

    const response = await scheduleController.scheduleRescheduleUpdate(1, data);

    expect(response.status).toBe(400);
    expect(response.message).toBe(
      "There are mandatory data that have not been filled in."
    );
  });

  test("scheduleConcludeUpdate with correct data", async () => {
    const response = await scheduleController.scheduleConcludeUpdate(1);

    expect(response.status).toBe(204);
  });

  test("scheduleConcludeUpdate with incorrect data", async () => {
    const response = await scheduleController.scheduleConcludeUpdate("sefwefw");

    expect(response.status).toBe(400);
    expect(response.message).toBe(
      "The specified ID is invalid. Make sure it is a numeric value."
    );
  });

  test("schedulesGet", async () => {
    const response = await scheduleController.schedulesGet();

    expect(response.status).toBe(200);
    expect(response).toHaveProperty("schedules");
    expect(response.schedules).toBeInstanceOf(Object);
  });

  test("schedulesStatistics", async () => {
    const response = await scheduleController.schedulesStatisticsGet(1);

    expect(response.status).toBe(200);
  });
});

describe("Unitary Tests SCHEDULE-STATUS", () => {
  test("scheduleStatusInsert with correct data", async () => {
    const data = {
      observation: "",
      status: "SCHEDULED",
      idSchedule: 1,
    };

    const response = await scheduleStatusController.scheduleStatusInsert(data);

    expect(response.status).toBe(201);
    expect(response.message).toBe("Record created successfully.");
  });

  test("scheduleStatusInsert with incorrect data", async () => {
    const data = {
      observation: 23424244,
      status: "SCHEDULED",
      idSchedule: 1,
    };

    const response = await scheduleStatusController.scheduleStatusInsert(data);

    expect(response.status).toBe(400);
    expect(response.message).toBe(
      "There are mandatory data that have not been filled in."
    );
  });
});
