import { useState, useEffect, useMemo } from "react";

// ─── HISTORICAL DATA ────────────────────────────────────────────────────────
// outcome: "A"=Renewed, "B"=Returned, "C"=Purchased
// disposition: "Ground"|"LBB"|"CB"|"" (blank for pre-2021 entries)
const HISTORICAL_RAW = [
  // JAN 2012
  {mo:"Jan",yr:2012,entries:[
    {name:"Collins Building",outcome:"B",disposition:""},
    {name:"Sakofksy",outcome:"A",disposition:""},
    {name:"Lampropoulos",outcome:"A",disposition:""},
    {name:"Zofnat",outcome:"B",disposition:""},
    {name:"Nozar Hakimian",outcome:"B",disposition:""},
    {name:"Doran",outcome:"B",disposition:""},
    {name:"Amendola",outcome:"A",disposition:""},
    {name:"Bunnenberg",outcome:"A",disposition:""},
  ]},
  // FEB 2012
  {mo:"Feb",yr:2012,entries:[
    {name:"Menduina",outcome:"B",disposition:""},
    {name:"Lorwood Co. Estate of Lorber",outcome:"B",disposition:""},
    {name:"Zehava Terrani",outcome:"A",disposition:""},
    {name:"Rudolf Hertz",outcome:"B",disposition:""},
    {name:"Michael Brunetti",outcome:"A",disposition:""},
    {name:"Hakimian",outcome:"B",disposition:""},
    {name:"Bader",outcome:"A",disposition:""},
    {name:"Robinson",outcome:"A",disposition:""},
    {name:"Caggiano",outcome:"A",disposition:""},
    {name:"Wiener",outcome:"A",disposition:""},
    {name:"Cartagena",outcome:"A",disposition:""},
    {name:"Donald Brachman",outcome:"A",disposition:""},
  ]},
  // MAR 2012
  {mo:"Mar",yr:2012,entries:[
    {name:"Samantha Lefcort",outcome:"B",disposition:""},
    {name:"Seyford",outcome:"B",disposition:""},
    {name:"Hafler",outcome:"B",disposition:""},
    {name:"Meisel",outcome:"A",disposition:""},
    {name:"Colliers",outcome:"A",disposition:""},
    {name:"Cartegena",outcome:"A",disposition:""},
    {name:"Singh",outcome:"C",disposition:""},
    {name:"Rattiner",outcome:"A",disposition:""},
    {name:"Jay Goldman",outcome:"A",disposition:""},
    {name:"Andre Cizmarik",outcome:"A",disposition:""},
    {name:"Boundary Fence",outcome:"A",disposition:""},
    {name:"David Klein",outcome:"A",disposition:""},
    {name:"Bert Karlin",outcome:"A",disposition:""},
    {name:"Yu",outcome:"B",disposition:""},
    {name:"Andrew Sandler",outcome:"A",disposition:""},
    {name:"Justus Recycling",outcome:"A",disposition:""},
  ]},
  // APR 2012
  {mo:"Apr",yr:2012,entries:[
    {name:"Jordan Bergstein",outcome:"A",disposition:""},
    {name:"Thomas Panetta",outcome:"A",disposition:""},
    {name:"Maryann Stroccia",outcome:"A",disposition:""},
    {name:"Carianne Music",outcome:"C",disposition:""},
    {name:"Bendich",outcome:"A",disposition:""},
    {name:"Berger",outcome:"A",disposition:""},
    {name:"Bokhour",outcome:"A",disposition:""},
    {name:"Silverman",outcome:"A",disposition:""},
    {name:"Avaricio",outcome:"A",disposition:""},
    {name:"HoxHolli-Melendez",outcome:"B",disposition:""},
    {name:"Mennes",outcome:"A",disposition:""},
  ]},
  // MAY 2012
  {mo:"May",yr:2012,entries:[
    {name:"Lewandowski",outcome:"A",disposition:""},
    {name:"Barnett",outcome:"C",disposition:""},
    {name:"Fotini Joannides",outcome:"A",disposition:""},
    {name:"Diamantakos",outcome:"A",disposition:""},
    {name:"Linda Godsen Robinson",outcome:"A",disposition:""},
    {name:"Mennes",outcome:"A",disposition:""},
    {name:"Berkson",outcome:"A",disposition:""},
    {name:"Another Door Ltd.",outcome:"A",disposition:""},
    {name:"Kalimian",outcome:"A",disposition:""},
  ]},
  // JUN 2012
  {mo:"Jun",yr:2012,entries:[
    {name:"Manna",outcome:"A",disposition:""},
    {name:"Bradley Sacks",outcome:"A",disposition:""},
    {name:"Elaine Bassik",outcome:"A",disposition:""},
    {name:"Neogenix Oncology",outcome:"B",disposition:""},
    {name:"Schechter",outcome:"A",disposition:""},
    {name:"Leichter",outcome:"A",disposition:""},
    {name:"Holland",outcome:"A",disposition:""},
    {name:"Neitzel",outcome:"A",disposition:""},
    {name:"Vomero",outcome:"A",disposition:""},
    {name:"Reimer",outcome:"A",disposition:""},
  ]},
  // JUL 2012
  {mo:"Jul",yr:2012,entries:[
    {name:"Slavin",outcome:"A",disposition:""},
    {name:"Radhaswamy",outcome:"A",disposition:""},
    {name:"Nichols",outcome:"A",disposition:""},
    {name:"Cherian Joseph",outcome:"B",disposition:""},
    {name:"Lombardi",outcome:"A",disposition:""},
    {name:"Fentress",outcome:"A",disposition:""},
    {name:"Kahn",outcome:"A",disposition:""},
    {name:"Lipps",outcome:"A",disposition:""},
    {name:"Evanov",outcome:"A",disposition:""},
    {name:"Wade",outcome:"A",disposition:""},
    {name:"Alfred Caruso",outcome:"A",disposition:""},
    {name:"Zummer",outcome:"A",disposition:""},
    {name:"Vassil",outcome:"A",disposition:""},
    {name:"Nichols",outcome:"A",disposition:""},
    {name:"Balin",outcome:"A",disposition:""},
    {name:"Lalezarian Developers",outcome:"A",disposition:""},
  ]},
  // AUG 2012
  {mo:"Aug",yr:2012,entries:[
    {name:"Bilicic",outcome:"A",disposition:""},
    {name:"Petroglia",outcome:"B",disposition:""},
    {name:"Sanford Morris",outcome:"A",disposition:""},
    {name:"Battaglia",outcome:"A",disposition:""},
    {name:"Springfield",outcome:"A",disposition:""},
    {name:"Nathel & Nathel",outcome:"A",disposition:""},
    {name:"Empire Equipment Sales",outcome:"A",disposition:""},
    {name:"Factor",outcome:"A",disposition:""},
    {name:"Sharf",outcome:"A",disposition:""},
    {name:"White",outcome:"A",disposition:""},
    {name:"Gardner",outcome:"A",disposition:""},
    {name:"Farber",outcome:"B",disposition:""},
    {name:"IES Logistics",outcome:"B",disposition:""},
  ]},
  // SEP 2012
  {mo:"Sep",yr:2012,entries:[
    {name:"Walter Stern",outcome:"B",disposition:""},
    {name:"Carmello Marullo",outcome:"A",disposition:""},
    {name:"James Rubin",outcome:"A",disposition:""},
    {name:"Seditsky",outcome:"A",disposition:""},
    {name:"Parisi",outcome:"A",disposition:""},
    {name:"Stokvis",outcome:"B",disposition:""},
    {name:"Teklits",outcome:"B",disposition:""},
    {name:"Foresto",outcome:"A",disposition:""},
    {name:"Ellis",outcome:"A",disposition:""},
    {name:"Rand Heckler",outcome:"B",disposition:""},
    {name:"Steinlein",outcome:"B",disposition:""},
    {name:"Lore",outcome:"A",disposition:""},
    {name:"Hoffman",outcome:"B",disposition:""},
    {name:"Kim",outcome:"B",disposition:""},
    {name:"Weissman",outcome:"B",disposition:""},
    {name:"Wirth",outcome:"A",disposition:""},
  ]},
  // OCT 2012
  {mo:"Oct",yr:2012,entries:[
    {name:"Dix",outcome:"B",disposition:""},
    {name:"Garcia",outcome:"B",disposition:""},
    {name:"Zack",outcome:"A",disposition:""},
    {name:"Singer",outcome:"A",disposition:""},
    {name:"Bluver",outcome:"B",disposition:""},
    {name:"Glueckert",outcome:"B",disposition:""},
    {name:"Dalis (PAC)",outcome:"A",disposition:""},
    {name:"NNP Enterprises",outcome:"A",disposition:""},
    {name:"Scalise",outcome:"A",disposition:""},
    {name:"Milevoj",outcome:"B",disposition:""},
    {name:"Vitale",outcome:"A",disposition:""},
    {name:"Lowenfeld",outcome:"A",disposition:""},
    {name:"Mole",outcome:"B",disposition:""},
    {name:"Loria",outcome:"B",disposition:""},
    {name:"Maietta",outcome:"B",disposition:""},
    {name:"Arlen",outcome:"A",disposition:""},
    {name:"Krimstock",outcome:"B",disposition:""},
  ]},
  // NOV 2012
  {mo:"Nov",yr:2012,entries:[
    {name:"Nichinson",outcome:"A",disposition:""},
    {name:"Dedomenico",outcome:"A",disposition:""},
    {name:"Picciano",outcome:"A",disposition:""},
    {name:"Putterman",outcome:"A",disposition:""},
    {name:"Cacciatore",outcome:"A",disposition:""},
    {name:"Yakaitis",outcome:"A",disposition:""},
    {name:"DiBenedetto",outcome:"A",disposition:""},
    {name:"Ruggiero",outcome:"A",disposition:""},
    {name:"Oreilly",outcome:"A",disposition:""},
    {name:"Cerrone",outcome:"A",disposition:""},
    {name:"Delia",outcome:"A",disposition:""},
    {name:"Van Blarcom",outcome:"A",disposition:""},
    {name:"American Trans Coil",outcome:"A",disposition:""},
    {name:"Moore",outcome:"A",disposition:""},
    {name:"Anthony Delia",outcome:"A",disposition:""},
    {name:"Ilibassi",outcome:"A",disposition:""},
    {name:"Sherman",outcome:"A",disposition:""},
    {name:"Reiss",outcome:"A",disposition:""},
    {name:"Robert Mann",outcome:"A",disposition:""},
    {name:"Andron",outcome:"B",disposition:""},
    {name:"Guiseppe Vitale",outcome:"A",disposition:""},
  ]},
  // DEC 2012
  {mo:"Dec",yr:2012,entries:[
    {name:"Yearwood",outcome:"B",disposition:""},
    {name:"Metro Fuel Oil",outcome:"B",disposition:""},
    {name:"Bellmar Construction",outcome:"A",disposition:""},
    {name:"TBO Landscape",outcome:"A",disposition:""},
    {name:"Bauman",outcome:"A",disposition:""},
    {name:"Schain",outcome:"A",disposition:""},
    {name:"Christina Becker",outcome:"B",disposition:""},
    {name:"Hana Cohen",outcome:"A",disposition:""},
    {name:"Burg",outcome:"B",disposition:""},
    {name:"Pappachristou",outcome:"B",disposition:""},
    {name:"Holtz",outcome:"B",disposition:""},
    {name:"McAloon & Friedman",outcome:"A",disposition:""},
    {name:"Sanator",outcome:"A",disposition:""},
    {name:"Kirwan",outcome:"A",disposition:""},
    {name:"Gillies",outcome:"A",disposition:""},
    {name:"Anita Smith",outcome:"A",disposition:""},
    {name:"Saliture",outcome:"A",disposition:""},
    {name:"Conway",outcome:"A",disposition:""},
    {name:"Lavelle",outcome:"B",disposition:""},
    {name:"Kliger",outcome:"A",disposition:""},
    {name:"Schain",outcome:"A",disposition:""},
    {name:"Giunta",outcome:"A",disposition:""},
    {name:"Manfre",outcome:"A",disposition:""},
    {name:"Verville",outcome:"A",disposition:""},
    {name:"McFar",outcome:"A",disposition:""},
  ]},
];

// I'll abbreviate the remaining years for performance — using monthly totals as summary records
// For a production system all entries would be stored; here we use aggregate data for 2013-2020
// and full entry data for 2021+ where disposition tracking began

const MONTHLY_AGGREGATES = [
  // 2013
  {mo:"Jan",yr:2013,a:7,b:2,c:0},{mo:"Feb",yr:2013,a:10,b:0,c:1},{mo:"Mar",yr:2013,a:18,b:3,c:2},
  {mo:"Apr",yr:2013,a:15,b:3,c:0},{mo:"May",yr:2013,a:16,b:10,c:0},{mo:"Jun",yr:2013,a:19,b:3,c:1},
  {mo:"Jul",yr:2013,a:23,b:8,c:0},{mo:"Aug",yr:2013,a:21,b:4,c:0},{mo:"Sep",yr:2013,a:23,b:5,c:0},
  {mo:"Oct",yr:2013,a:18,b:12,c:0},{mo:"Nov",yr:2013,a:20,b:4,c:2},{mo:"Dec",yr:2013,a:20,b:1,c:6},
  // 2014
  {mo:"Jan",yr:2014,a:28,b:17,c:4},{mo:"Feb",yr:2014,a:32,b:11,c:0},{mo:"Mar",yr:2014,a:25,b:9,c:3},
  {mo:"Apr",yr:2014,a:29,b:12,c:0},{mo:"May",yr:2014,a:22,b:24,c:0},{mo:"Jun",yr:2014,a:38,b:14,c:1},
  {mo:"Jul",yr:2014,a:34,b:16,c:1},{mo:"Aug",yr:2014,a:26,b:22,c:7},{mo:"Sep",yr:2014,a:28,b:16,c:1},
  {mo:"Oct",yr:2014,a:26,b:19,c:2},{mo:"Nov",yr:2014,a:19,b:16,c:1},{mo:"Dec",yr:2014,a:35,b:28,c:0},
  // 2015
  {mo:"Jan",yr:2015,a:13,b:16,c:0},{mo:"Feb",yr:2015,a:11,b:16,c:0},{mo:"Mar",yr:2015,a:10,b:28,c:0},
  {mo:"Apr",yr:2015,a:25,b:17,c:3},{mo:"May",yr:2015,a:16,b:18,c:2},{mo:"Jun",yr:2015,a:26,b:20,c:2},
  {mo:"Jul",yr:2015,a:42,b:14,c:0},{mo:"Aug",yr:2015,a:27,b:14,c:0},{mo:"Sep",yr:2015,a:26,b:20,c:0},
  {mo:"Oct",yr:2015,a:25,b:25,c:0},{mo:"Nov",yr:2015,a:24,b:17,c:0},{mo:"Dec",yr:2015,a:36,b:24,c:0},
  // 2016
  {mo:"Jan",yr:2016,a:21,b:23,c:0},{mo:"Feb",yr:2016,a:24,b:21,c:0},{mo:"Mar",yr:2016,a:27,b:35,c:0},
  {mo:"Apr",yr:2016,a:26,b:20,c:0},{mo:"May",yr:2016,a:25,b:16,c:0},{mo:"Jun",yr:2016,a:31,b:28,c:0},
  {mo:"Jul",yr:2016,a:28,b:18,c:0},{mo:"Aug",yr:2016,a:23,b:27,c:0},{mo:"Sep",yr:2016,a:31,b:32,c:0},
  {mo:"Oct",yr:2016,a:25,b:21,c:0},{mo:"Nov",yr:2016,a:42,b:38,c:0},{mo:"Dec",yr:2016,a:34,b:19,c:0},
  // 2017
  {mo:"Jan",yr:2017,a:14,b:21,c:0},{mo:"Feb",yr:2017,a:26,b:28,c:0},{mo:"Mar",yr:2017,a:30,b:29,c:1},
  {mo:"Apr",yr:2017,a:42,b:19,c:1},{mo:"May",yr:2017,a:26,b:29,c:2},{mo:"Jun",yr:2017,a:29,b:23,c:0},
  {mo:"Jul",yr:2017,a:35,b:40,c:0},{mo:"Aug",yr:2017,a:22,b:28,c:0},{mo:"Sep",yr:2017,a:21,b:26,c:1},
  {mo:"Oct",yr:2017,a:35,b:27,c:0},{mo:"Nov",yr:2017,a:28,b:25,c:0},{mo:"Dec",yr:2017,a:39,b:30,c:0},
  // 2018
  {mo:"Jan",yr:2018,a:19,b:17,c:1},{mo:"Feb",yr:2018,a:30,b:23,c:3},{mo:"Mar",yr:2018,a:32,b:27,c:2},
  {mo:"Apr",yr:2018,a:28,b:23,c:0},{mo:"May",yr:2018,a:34,b:23,c:0},{mo:"Jun",yr:2018,a:37,b:24,c:0},
  {mo:"Jul",yr:2018,a:12,b:23,c:0},{mo:"Aug",yr:2018,a:18,b:22,c:0},{mo:"Sep",yr:2018,a:20,b:25,c:0},
  {mo:"Oct",yr:2018,a:36,b:19,c:0},{mo:"Nov",yr:2018,a:22,b:25,c:0},{mo:"Dec",yr:2018,a:28,b:20,c:0},
  // 2019
  {mo:"Jan",yr:2019,a:25,b:27,c:0},{mo:"Feb",yr:2019,a:24,b:10,c:0},{mo:"Mar",yr:2019,a:42,b:21,c:2},
  {mo:"Apr",yr:2019,a:33,b:22,c:0},{mo:"May",yr:2019,a:39,b:23,c:0},{mo:"Jun",yr:2019,a:41,b:14,c:2},
  {mo:"Jul",yr:2019,a:29,b:16,c:0},{mo:"Aug",yr:2019,a:39,b:21,c:0},{mo:"Sep",yr:2019,a:36,b:23,c:0},
  {mo:"Oct",yr:2019,a:65,b:28,c:0},{mo:"Nov",yr:2019,a:38,b:28,c:0},{mo:"Dec",yr:2019,a:47,b:24,c:0},
  // 2020
  {mo:"Jan",yr:2020,a:30,b:24,c:0},{mo:"Feb",yr:2020,a:37,b:19,c:0},{mo:"Mar",yr:2020,a:17,b:13,c:0},
  {mo:"Apr",yr:2020,a:1,b:1,c:0},{mo:"May",yr:2020,a:25,b:30,c:0},{mo:"Jun",yr:2020,a:41,b:23,c:0},
  {mo:"Jul",yr:2020,a:37,b:21,c:1},{mo:"Aug",yr:2020,a:29,b:22,c:0},{mo:"Sep",yr:2020,a:23,b:24,c:0},
  {mo:"Oct",yr:2020,a:35,b:25,c:0},{mo:"Nov",yr:2020,a:43,b:13,c:0},{mo:"Dec",yr:2020,a:48,b:23,c:3},
];

// 2021+ with disposition tracking (using monthly totals with LBB/CB/Ground breakdown)
const MONTHLY_WITH_DISP = [
  // 2021
  {mo:"Jan",yr:2021,a:30,b:8,c:0,lbb:0,cb:0,ground:0},
  {mo:"Feb",yr:2021,a:21,b:12,c:1,lbb:0,cb:0,ground:0},
  {mo:"Mar",yr:2021,a:38,b:20,c:1,lbb:0,cb:0,ground:0},
  {mo:"Apr",yr:2021,a:32,b:8,c:0,lbb:0,cb:0,ground:0},
  {mo:"May",yr:2021,a:29,b:14,c:1,lbb:0,cb:0,ground:0},
  {mo:"Jun",yr:2021,a:22,b:12,c:0,lbb:0,cb:0,ground:0},
  {mo:"Jul",yr:2021,a:23,b:15,c:0,lbb:0,cb:0,ground:0},
  {mo:"Aug",yr:2021,a:16,b:12,c:3,lbb:3,cb:0,ground:0},
  {mo:"Sep",yr:2021,a:20,b:10,c:7,lbb:7,cb:0,ground:0},
  {mo:"Oct",yr:2021,a:20,b:14,c:5,lbb:5,cb:0,ground:0},
  {mo:"Nov",yr:2021,a:8,b:9,c:14,lbb:14,cb:0,ground:0},
  {mo:"Dec",yr:2021,a:10,b:8,c:14,lbb:14,cb:0,ground:0},
  // 2022
  {mo:"Jan",yr:2022,a:14,b:9,c:18,lbb:18,cb:0,ground:0},
  {mo:"Feb",yr:2022,a:22,b:13,c:12,lbb:12,cb:0,ground:0},
  {mo:"Mar",yr:2022,a:33,b:9,c:8,lbb:8,cb:0,ground:0},
  {mo:"Apr",yr:2022,a:41,b:8,c:6,lbb:6,cb:0,ground:0},
  {mo:"May",yr:2022,a:24,b:2,c:10,lbb:10,cb:0,ground:0},
  {mo:"Jun",yr:2022,a:26,b:10,c:21,lbb:21,cb:0,ground:0},
  {mo:"Jul",yr:2022,a:37,b:13,c:11,lbb:11,cb:0,ground:0},
  {mo:"Aug",yr:2022,a:20,b:8,c:10,lbb:10,cb:0,ground:0},
  {mo:"Sep",yr:2022,a:33,b:13,c:7,lbb:7,cb:0,ground:0},
  {mo:"Oct",yr:2022,a:32,b:6,c:6,lbb:6,cb:0,ground:0},
  {mo:"Nov",yr:2022,a:31,b:11,c:14,lbb:14,cb:0,ground:0},
  {mo:"Dec",yr:2022,a:27,b:14,c:20,lbb:20,cb:0,ground:0},
  // 2023
  {mo:"Jan",yr:2023,a:23,b:12,c:7,lbb:0,cb:0,ground:0},
  {mo:"Feb",yr:2023,a:26,b:10,c:8,lbb:0,cb:19,ground:0},
  {mo:"Mar",yr:2023,a:31,b:13,c:15,lbb:0,cb:0,ground:0},
  {mo:"Apr",yr:2023,a:34,b:9,c:6,lbb:0,cb:0,ground:0},
  {mo:"May",yr:2023,a:24,b:14,c:7,lbb:0,cb:0,ground:0},
  {mo:"Jun",yr:2023,a:35,b:7,c:9,lbb:0,cb:0,ground:0},
  {mo:"Jul",yr:2023,a:29,b:11,c:0,lbb:0,cb:0,ground:0},
  {mo:"Aug",yr:2023,a:40,b:8,c:12,lbb:0,cb:0,ground:0},
  {mo:"Sep",yr:2023,a:37,b:20,c:19,lbb:0,cb:0,ground:0},
  {mo:"Oct",yr:2023,a:33,b:17,c:18,lbb:0,cb:0,ground:0},
  {mo:"Nov",yr:2023,a:42,b:18,c:9,lbb:0,cb:0,ground:0},
  {mo:"Dec",yr:2023,a:52,b:17,c:16,lbb:0,cb:0,ground:0},
  // 2024
  {mo:"Jan",yr:2024,a:37,b:11,c:9,lbb:9,cb:13,ground:31},
  {mo:"Feb",yr:2024,a:49,b:15,c:12,lbb:12,cb:26,ground:34},
  {mo:"Mar",yr:2024,a:40,b:15,c:9,lbb:9,cb:24,ground:26},
  {mo:"Apr",yr:2024,a:34,b:13,c:11,lbb:11,cb:18,ground:26},
  {mo:"May",yr:2024,a:43,b:14,c:7,lbb:6,cb:29,ground:24},
  {mo:"Jun",yr:2024,a:30,b:10,c:5,lbb:5,cb:12,ground:23},
  {mo:"Jul",yr:2024,a:31,b:7,c:12,lbb:10,cb:21,ground:13},
  {mo:"Aug",yr:2024,a:25,b:12,c:4,lbb:4,cb:22,ground:11},
  {mo:"Sep",yr:2024,a:34,b:7,c:9,lbb:0,cb:0,ground:0},
  {mo:"Oct",yr:2024,a:30,b:6,c:2,lbb:2,cb:28,ground:3},
  {mo:"Nov",yr:2024,a:17,b:4,c:5,lbb:5,cb:12,ground:9},
  {mo:"Dec",yr:2024,a:22,b:5,c:3,lbb:3,cb:14,ground:11},
  // 2025
  {mo:"Jan",yr:2025,a:20,b:7,c:1,lbb:0,cb:0,ground:0},
  {mo:"Feb",yr:2025,a:22,b:4,c:6,lbb:6,cb:18,ground:8},
  {mo:"Mar",yr:2025,a:34,b:8,c:5,lbb:5,cb:27,ground:12},
  {mo:"Apr",yr:2025,a:28,b:8,c:7,lbb:7,cb:29,ground:4},
  {mo:"May",yr:2025,a:41,b:5,c:4,lbb:4,cb:35,ground:7},
  {mo:"Jun",yr:2025,a:25,b:9,c:4,lbb:4,cb:26,ground:5},
  {mo:"Jul",yr:2025,a:22,b:11,c:8,lbb:8,cb:24,ground:6},
  {mo:"Aug",yr:2025,a:29,b:8,c:5,lbb:5,cb:27,ground:2},
  {mo:"Sep",yr:2025,a:24,b:10,c:6,lbb:0,cb:26,ground:0},
  {mo:"Oct",yr:2025,a:23,b:14,c:2,lbb:3,cb:22,ground:5},
  {mo:"Nov",yr:2025,a:17,b:8,c:8,lbb:7,cb:18,ground:3},
  {mo:"Dec",yr:2025,a:33,b:9,c:2,lbb:2,cb:25,ground:4},
  // 2026
  {mo:"Jan",yr:2026,a:18,b:9,c:4,lbb:4,cb:17,ground:0},
  {mo:"Feb",yr:2026,a:18,b:5,c:4,lbb:4,cb:18,ground:0},
  {mo:"Mar",yr:2026,a:29,b:6,c:4,lbb:3,cb:24,ground:0},
  {mo:"Apr",yr:2026,a:19,b:13,c:4,lbb:4,cb:22,ground:3},
  {mo:"May",yr:2026,a:11,b:13,c:6,lbb:6,cb:14,ground:0},
  {mo:"Jun",yr:2026,a:3,b:7,c:3,lbb:3,cb:5,ground:3},
];

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const MONTH_FULL = {Jan:"January",Feb:"February",Mar:"March",Apr:"April",May:"May",Jun:"June",
  Jul:"July",Aug:"August",Sep:"September",Oct:"October",Nov:"November",Dec:"December"};
const NB_BLUE = "#1e85d0";
const APP_VERSION = "v1.05";
const NB_LOGO = "data:image/png;base64,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";

// ─── STORAGE KEY ─────────────────────────────────────────────────────────────
const STORAGE_KEY = "nb_lease_entries_v1";

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const currentYear = new Date().getFullYear();
  const currentMonth = MONTHS[new Date().getMonth()];

  const [view, setView] = useState("entry"); // "entry" | "report" | "yearly"
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  // Live entries stored in state (and persisted to storage)
  const [liveEntries, setLiveEntries] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // Entry form state
  const [form, setForm] = useState({name:"",outcome:"A",disposition:"CB",broker:""});
  const [saving, setSaving] = useState(false);

  // Load from storage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setLiveEntries(JSON.parse(saved));
    } catch(e) {}
    setLoaded(true);
  }, []);

  // Save to storage whenever liveEntries changes
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(liveEntries));
    } catch(e) {}
  }, [liveEntries, loaded]);

  // Build a unified data structure for reports
  const allMonthlyData = useMemo(() => {
    const map = {};

    // Historical raw entries (2012)
    HISTORICAL_RAW.forEach(({mo,yr,entries}) => {
      const key = `${yr}-${mo}`;
      map[key] = map[key] || {year:yr,month:mo,entries:[],isHistoric:true};
      map[key].entries.push(...entries.map(e=>({...e,id:`hist-${yr}-${mo}-${e.name}`})));
    });

    // Monthly aggregates (2013-2020) — stored as aggregate-only records
    MONTHLY_AGGREGATES.forEach(({mo,yr,a,b,c}) => {
      const key = `${yr}-${mo}`;
      map[key] = {year:yr,month:mo,entries:[],isAggregate:true,agg:{a,b,c,lbb:0,cb:0,ground:0}};
    });

    // Monthly with disposition (2021-2026 partial)
    MONTHLY_WITH_DISP.forEach(({mo,yr,a,b,c,lbb,cb,ground}) => {
      const key = `${yr}-${mo}`;
      map[key] = {year:yr,month:mo,entries:[],isAggregate:true,agg:{a,b,c,lbb,cb,ground}};
    });

    // Live entries
    liveEntries.forEach(e => {
      const key = `${e.year}-${e.month}`;
      map[key] = map[key] || {year:e.year,month:e.month,entries:[],isHistoric:false};
      map[key].entries.push(e);
    });

    return map;
  }, [liveEntries]);

  function getMonthTotals(year, month) {
    const key = `${year}-${month}`;
    const rec = allMonthlyData[key];
    if (!rec) return {a:0,b:0,c:0,lbb:0,cb:0,ground:0};
    if (rec.isAggregate) return rec.agg;
    const entries = rec.entries;
    return {
      a: entries.filter(e=>e.outcome==="A").length,
      b: entries.filter(e=>e.outcome==="B").length,
      c: entries.filter(e=>e.outcome==="C").length,
      lbb: entries.filter(e=>e.disposition==="LBB").length,
      cb: entries.filter(e=>e.disposition==="CB").length,
      ground: entries.filter(e=>e.disposition==="Ground").length,
    };
  }

  function getYearTotals(year) {
    let totals = {a:0,b:0,c:0,lbb:0,cb:0,ground:0};
    MONTHS.forEach(mo => {
      const t = getMonthTotals(year, mo);
      totals.a += t.a; totals.b += t.b; totals.c += t.c;
      totals.lbb += t.lbb; totals.cb += t.cb; totals.ground += t.ground;
    });
    return totals;
  }

  function isMonthLocked(year, month) {
    const now = new Date();
    const monthIndex = MONTHS.indexOf(month);
    const lockDate = new Date(year, monthIndex + 2, 1);
    return now >= lockDate;
  }

  function addEntry() {
    if (!form.name.trim()) return;
    if (isMonthLocked(selectedYear, selectedMonth)) return;
    setSaving(true);
    const newEntry = {
      id: `live-${Date.now()}-${Math.random()}`,
      name: form.name.trim(),
      outcome: form.outcome,
      disposition: form.disposition,
      broker: form.broker.trim(),
      year: selectedYear,
      month: selectedMonth,
      timestamp: new Date().toISOString(),
    };
    setLiveEntries(prev => [...prev, newEntry]);
    setForm({name:"",outcome:"A",disposition:"CB",broker:""});
    setTimeout(()=>setSaving(false), 300);
  }

  function deleteEntry(id) {
    setLiveEntries(prev => prev.filter(e=>e.id!==id));
  }

  const currentKey = `${selectedYear}-${selectedMonth}`;
  const currentRec = allMonthlyData[currentKey];
  const currentEntries = currentRec ? (currentRec.isAggregate ? [] : currentRec.entries) : [];
  const currentLiveEntries = liveEntries.filter(e => e.year === selectedYear && e.month === selectedMonth);
  const currentTotals = getMonthTotals(selectedYear, selectedMonth);
  const isCurrentMonthAggregate = currentRec?.isAggregate || false;

  // YTD for selected year
  const ytd = useMemo(() => {
    let totals = {a:0,b:0,c:0,lbb:0,cb:0,ground:0};
    const monthIndex = MONTHS.indexOf(selectedMonth);
    for (let i=0; i<=monthIndex; i++) {
      const t = getMonthTotals(selectedYear, MONTHS[i]);
      totals.a+=t.a; totals.b+=t.b; totals.c+=t.c;
      totals.lbb+=t.lbb; totals.cb+=t.cb; totals.ground+=t.ground;
    }
    return totals;
  }, [selectedYear, selectedMonth, liveEntries]);

  const years = [];
  for (let y=2012; y<=2050; y++) years.push(y);

  // Printable report
  function handlePrint() { window.print(); }

  const outcomeLabel = {A:"Renewed",B:"Returned",C:"Purchased"};
  const outcomeColor = {A:"#166534",B:"#991b1b",C:"#92400e"};
  const outcomeBg = {A:"#dcfce7",B:"#fee2e2",C:"#fef3c7"};

  return (
    <div style={{fontFamily:"'Segoe UI',system-ui,sans-serif",minHeight:"100vh",background:"#38bdf8",color:"#1e293b",}}>
      {/* Print styles */}
      <style>{`
        @media print {
          .no-print { display:none!important; }
          .print-section { display:block!important; }
          body { background:white; }
        }
        @media screen {
          .print-section { display:none; }
        }
      `}</style>

      {/* HEADER */}
      <header className="no-print" style={{background:"white",borderBottom:`3px solid ${NB_BLUE}`,padding:"0 24px",display:"flex",alignItems:"center",gap:16,boxShadow:"0 2px 8px rgba(0,0,0,0.08)"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0"}}>
          <img src={NB_LOGO} alt="North Bay Cadillac GMC" style={{height:48,objectFit:"contain"}}/>
          <div style={{width:1,height:36,background:"#e2e8f0",margin:"0 4px"}}/>
          <div style={{fontWeight:700,fontSize:15,color:"#475569"}}>Lease Retention</div>
        </div>
        <div style={{flex:1}}/>
        <nav style={{display:"flex",gap:4}}>
          {[["entry","Data Entry"],["report","Monthly Report"],["yearly","Year Summary"]].map(([v,label])=>(
            <button key={v} onClick={()=>setView(v)} style={{
              padding:"8px 16px",borderRadius:6,border:"none",cursor:"pointer",fontWeight:600,fontSize:13,
              background:view===v ? NB_BLUE : "transparent",
              color:view===v ? "white" : "#475569",
              transition:"all 0.15s"
            }}>{label}</button>
          ))}
        </nav>
        <div style={{marginLeft:8,fontSize:12,color:"#94a3b8",fontWeight:600,letterSpacing:"0.5px"}}>{APP_VERSION}</div>
      </header>

      {/* MONTH/YEAR SELECTOR */}
      <div className="no-print" style={{background:"white",borderBottom:"1px solid #e2e8f0",padding:"10px 24px",display:"flex",alignItems:"center",gap:12}}>
        <span style={{fontSize:13,fontWeight:600,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.5px"}}>Period</span>
        <select value={selectedMonth} onChange={e=>setSelectedMonth(e.target.value)}
          style={{padding:"6px 10px",border:`1px solid ${NB_BLUE}`,borderRadius:6,fontSize:14,fontWeight:600,color:NB_BLUE,background:"white",cursor:"pointer"}}>
          {MONTHS.map(m=><option key={m} value={m}>{MONTH_FULL[m]}</option>)}
        </select>
        <select value={selectedYear} onChange={e=>setSelectedYear(Number(e.target.value))}
          style={{padding:"6px 10px",border:`1px solid ${NB_BLUE}`,borderRadius:6,fontSize:14,fontWeight:600,color:NB_BLUE,background:"white",cursor:"pointer"}}>
          {years.map(y=><option key={y} value={y}>{y}</option>)}
        </select>
        <span style={{marginLeft:8,fontSize:14,color:"#94a3b8"}}>
          {MONTH_FULL[selectedMonth]} {selectedYear}
        </span>
        <button 
          onClick={()=>{setSelectedMonth(currentMonth);setSelectedYear(currentYear);}}
          disabled={selectedMonth === currentMonth && selectedYear === currentYear}
          style={{marginLeft:12,padding:"6px 16px",background:(selectedMonth===currentMonth&&selectedYear===currentYear)?"#cbd5e1":NB_BLUE,color:"white",border:"none",borderRadius:6,fontSize:13,fontWeight:700,cursor:(selectedMonth===currentMonth&&selectedYear===currentYear)?"default":"pointer",transition:"background 0.15s"}}>
          ⬅ This Month
        </button>
      </div>

      <main style={{maxWidth:1000,margin:"0 auto",padding:"24px 16px"}}>

        {/* ── DATA ENTRY VIEW ── */}
        {view==="entry" && (
          <div>
            {/* Entry Form */}
            <div className="no-print" style={{background:"white",borderRadius:10,border:`1px solid #38bdf8`,borderTop:`3px solid ${NB_BLUE}`,padding:24,marginBottom:24,boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
              <h2 style={{margin:"0 0 18px",fontSize:16,fontWeight:700,color:"#1e293b"}}>
                Add Customer — {MONTH_FULL[selectedMonth]} {selectedYear}
              </h2>
              {isMonthLocked(selectedYear, selectedMonth) && (
                <div style={{background:"#fee2e2",border:"1px solid #fca5a5",borderRadius:6,padding:"8px 12px",marginBottom:16,fontSize:13,color:"#991b1b",fontWeight:600}}>
                  🔒 This month is locked — no changes can be made after 2 months have passed.
                </div>
              )}

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:12}}>
                <div>
                  <label style={{display:"block",fontSize:12,fontWeight:600,color:"#64748b",marginBottom:4,textTransform:"uppercase",letterSpacing:"0.5px"}}>Customer Name *</label>
                  <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}
                    onKeyDown={e=>e.key==="Enter"&&addEntry()}
                    placeholder="Enter name..."
                    style={{width:"100%",padding:"8px 10px",border:"1px solid #cbd5e1",borderRadius:6,fontSize:14,boxSizing:"border-box"}}/>
                </div>
                <div>
                  <label style={{display:"block",fontSize:12,fontWeight:600,color:"#64748b",marginBottom:4,textTransform:"uppercase",letterSpacing:"0.5px"}}>Outcome</label>
                  <select value={form.outcome} onChange={e=>setForm(f=>({...f,outcome:e.target.value}))}
                    style={{width:"100%",padding:"8px 10px",border:"1px solid #cbd5e1",borderRadius:6,fontSize:14}}>
                    <option value="A">A — Lease Renewed</option>
                    <option value="B">B — Only Returned</option>
                    <option value="C">C — Purchased Old Lease</option>
                  </select>
                </div>
                <div>
                  <label style={{display:"block",fontSize:12,fontWeight:600,color:"#64748b",marginBottom:4,textTransform:"uppercase",letterSpacing:"0.5px"}}>Disposition</label>
                  <select value={form.disposition} onChange={e=>setForm(f=>({...f,disposition:e.target.value}))}
                    style={{width:"100%",padding:"8px 10px",border:"1px solid #cbd5e1",borderRadius:6,fontSize:14}}>
                    <option value="CB">CB</option>
                    <option value="LBB">LBB — Lease Buy Back</option>
                    <option value="Ground">Ground</option>
                  </select>
                </div>
              </div>
              <div style={{display:"flex",gap:12,alignItems:"flex-end"}}>
                <div style={{flex:1}}>
                  <label style={{display:"block",fontSize:12,fontWeight:600,color:"#64748b",marginBottom:4,textTransform:"uppercase",letterSpacing:"0.5px"}}>Broker / Salesperson (optional)</label>
                  <input value={form.broker} onChange={e=>setForm(f=>({...f,broker:e.target.value}))}
                    placeholder="e.g. JG, JY Broker..."
                    style={{width:"100%",padding:"8px 10px",border:"1px solid #cbd5e1",borderRadius:6,fontSize:14,boxSizing:"border-box"}}/>
                </div>
                <button onClick={addEntry} disabled={!form.name.trim() || isMonthLocked(selectedYear, selectedMonth)}
                  style={{padding:"9px 24px",background:(form.name.trim()&&!isMonthLocked(selectedYear,selectedMonth))?NB_BLUE:"#94a3b8",color:"white",border:"none",borderRadius:6,fontSize:14,fontWeight:700,cursor:(form.name.trim()&&!isMonthLocked(selectedYear,selectedMonth))?"pointer":"not-allowed",transition:"background 0.15s"}}>
                  {saving ? "Adding…" : "+ Add Entry"}
                </button>
              </div>
            </div>

            {/* MTD Totals card */}
            <TotalsCard totals={currentTotals} label={`MTD — ${MONTH_FULL[selectedMonth]} ${selectedYear}`} showDisp={selectedYear>=2021}/>
            <div style={{marginTop:16}}>
              <TotalsCard totals={ytd} label={`YTD — Through ${MONTH_FULL[selectedMonth]} ${selectedYear}`} showDisp={selectedYear>=2021}/>
            </div>

            {/* Current month live entries — below tallies */}
            {currentEntries.filter(e=>!e.id?.startsWith("hist-")).length > 0 && (
              <div className="no-print" style={{background:"white",borderRadius:10,border:"1px solid #38bdf8",overflow:"hidden",marginTop:20}}>
                <div style={{padding:"14px 20px",borderBottom:"1px solid #f1f5f9",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontWeight:700,fontSize:15}}>Entries — {MONTH_FULL[selectedMonth]} {selectedYear}</span>
                  <span style={{fontSize:13,color:"#64748b"}}>{currentEntries.filter(e=>!e.id?.startsWith("hist-")).length} entries this month</span>
                </div>
                <table style={{width:"100%",borderCollapse:"collapse"}}>
                  <thead>
                    <tr style={{background:"#f8fafc"}}>
                      {["Customer","Outcome","Disposition","Broker",""].map(h=>(
                        <th key={h} style={{padding:"10px 16px",textAlign:"left",fontSize:12,fontWeight:600,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.5px"}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentEntries.filter(e=>!e.id?.startsWith("hist-")).map((e,i)=>(
                      <tr key={e.id} style={{borderTop:"1px solid #f1f5f9",background:i%2===0?"white":"#fafafa"}}>
                        <td style={{padding:"10px 16px",fontWeight:500}}>{e.name}</td>
                        <td style={{padding:"10px 16px"}}>
                          <span style={{display:"inline-block",padding:"2px 10px",borderRadius:20,fontSize:12,fontWeight:600,background:outcomeBg[e.outcome],color:outcomeColor[e.outcome]}}>
                            {e.outcome} — {outcomeLabel[e.outcome]}
                          </span>
                        </td>
                        <td style={{padding:"10px 16px",fontSize:13,color:"#475569"}}>{e.disposition||"—"}</td>
                        <td style={{padding:"10px 16px",fontSize:13,color:"#64748b"}}>{e.broker||"—"}</td>
                        <td style={{padding:"10px 16px"}}>
                          {!isMonthLocked(selectedYear, selectedMonth) && <button onClick={()=>deleteEntry(e.id)} style={{background:"none",border:"none",color:"#ef4444",cursor:"pointer",fontSize:18,lineHeight:1}}>×</button>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── MONTHLY REPORT VIEW ── */}
        {view==="report" && (
          <div>
            <div className="no-print" style={{display:"flex",justifyContent:"flex-end",marginBottom:16}}>
              <button onClick={handlePrint} style={{padding:"8px 20px",background:NB_BLUE,color:"white",border:"none",borderRadius:6,fontWeight:600,cursor:"pointer",fontSize:14}}>
                🖨️ Print / Save PDF
              </button>
            </div>

            {/* Printable report */}
            <div style={{background:"white",borderRadius:10,border:"1px solid #38bdf8",padding:32,boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
              {/* Report header */}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24,paddingBottom:16,borderBottom:`2px solid ${NB_BLUE}`}}>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
                    <img src={NB_LOGO} alt="North Bay Cadillac GMC" style={{height:40,objectFit:"contain"}}/>
                  </div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:20,fontWeight:800,color:NB_BLUE}}>{MONTH_FULL[selectedMonth]} {selectedYear}</div>
                  <div style={{fontSize:12,color:"#94a3b8"}}>Printed {new Date().toLocaleDateString()}</div>
                </div>
              </div>

              {/* MTD Totals */}
              <ReportTotalsTable label={`Current Month Totals — ${MONTH_FULL[selectedMonth]} ${selectedYear}`} totals={currentTotals} showDisp={selectedYear>=2021}/>

              <div style={{marginTop:20}}>
                <ReportTotalsTable label={`Year-to-Date Totals — Through ${MONTH_FULL[selectedMonth]} ${selectedYear}`} totals={ytd} showDisp={selectedYear>=2021}/>
              </div>

              {/* Monthly customer list — below totals */}
              {currentLiveEntries.length > 0 && (
                <div style={{marginTop:24}}>
                  <div style={{fontWeight:700,fontSize:14,color:"#475569",marginBottom:10,textTransform:"uppercase",letterSpacing:"0.5px"}}>Customer Entries</div>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                    <thead>
                      <tr style={{background:"#f8fafc"}}>
                        <th style={{padding:"8px 12px",textAlign:"left",fontWeight:600,color:"#64748b",borderBottom:"1px solid #e2e8f0"}}>#</th>
                        <th style={{padding:"8px 12px",textAlign:"left",fontWeight:600,color:"#64748b",borderBottom:"1px solid #e2e8f0"}}>Customer</th>
                        <th style={{padding:"8px 12px",textAlign:"left",fontWeight:600,color:"#64748b",borderBottom:"1px solid #e2e8f0"}}>Outcome</th>
                        <th style={{padding:"8px 12px",textAlign:"left",fontWeight:600,color:"#64748b",borderBottom:"1px solid #e2e8f0"}}>Disposition</th>
                        <th style={{padding:"8px 12px",textAlign:"left",fontWeight:600,color:"#64748b",borderBottom:"1px solid #e2e8f0"}}>Broker</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentLiveEntries.map((e,i)=>(
                        <tr key={e.id} style={{borderBottom:"1px solid #f1f5f9"}}>
                          <td style={{padding:"7px 12px",color:"#94a3b8"}}>{i+1}</td>
                          <td style={{padding:"7px 12px",fontWeight:500}}>{e.name}</td>
                          <td style={{padding:"7px 12px"}}>
                            <span style={{padding:"1px 8px",borderRadius:12,fontSize:11,fontWeight:700,background:outcomeBg[e.outcome],color:outcomeColor[e.outcome]}}>
                              {e.outcome} — {outcomeLabel[e.outcome]}
                            </span>
                          </td>
                          <td style={{padding:"7px 12px",color:"#475569"}}>{e.disposition||"—"}</td>
                          <td style={{padding:"7px 12px",color:"#64748b"}}>{e.broker||"—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── YEARLY SUMMARY VIEW ── */}
        {view==="yearly" && (
          <div>
            <div className="no-print" style={{display:"flex",justifyContent:"flex-end",marginBottom:16}}>
              <button onClick={handlePrint} style={{padding:"8px 20px",background:NB_BLUE,color:"white",border:"none",borderRadius:6,fontWeight:600,cursor:"pointer",fontSize:14}}>
                🖨️ Print / Save PDF
              </button>
            </div>
            <div style={{background:"white",borderRadius:10,border:"1px solid #38bdf8",overflow:"hidden",boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
              <div style={{padding:"20px 24px",borderBottom:`2px solid ${NB_BLUE}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontWeight:800,fontSize:18,color:"#1e293b"}}>Annual Summary — {selectedYear}</div>
                  <div style={{fontSize:13,color:"#64748b"}}>North Bay Cadillac · GMC Lease Retention</div>
                </div>
                <div style={{fontSize:12,color:"#94a3b8"}}>Printed {new Date().toLocaleDateString()}</div>
              </div>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                  <thead>
                    <tr style={{background:"#f8fafc"}}>
                      <th style={{padding:"10px 16px",textAlign:"left",fontWeight:600,color:"#64748b",borderBottom:"1px solid #e2e8f0"}}>Month</th>
                      <th style={{padding:"10px 16px",textAlign:"center",fontWeight:600,color:"#166534",borderBottom:"1px solid #e2e8f0"}}>Renewed</th>
                      <th style={{padding:"10px 16px",textAlign:"center",fontWeight:600,color:"#991b1b",borderBottom:"1px solid #e2e8f0"}}>Returned</th>
                      <th style={{padding:"10px 16px",textAlign:"center",fontWeight:600,color:"#92400e",borderBottom:"1px solid #e2e8f0"}}>Purchased</th>
                      {selectedYear>=2021 && <>
                        <th style={{padding:"10px 16px",textAlign:"center",fontWeight:600,color:"#64748b",borderBottom:"1px solid #e2e8f0"}}>LBB</th>
                        <th style={{padding:"10px 16px",textAlign:"center",fontWeight:600,color:"#64748b",borderBottom:"1px solid #e2e8f0"}}>CB</th>
                        <th style={{padding:"10px 16px",textAlign:"center",fontWeight:600,color:"#64748b",borderBottom:"1px solid #e2e8f0"}}>Ground</th>
                      </>}
                      <th style={{padding:"10px 16px",textAlign:"center",fontWeight:600,color:"#1e293b",borderBottom:"1px solid #e2e8f0"}}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MONTHS.map((mo,i)=>{
                      const t = getMonthTotals(selectedYear, mo);
                      const total = t.a+t.b+t.c;
                      const hasData = total > 0;
                      return (
                        <tr key={mo} style={{borderBottom:"1px solid #f1f5f9",background:i%2===0?"white":"#fafafa",opacity:hasData?1:0.4}}>
                          <td style={{padding:"10px 16px",fontWeight:600}}>{MONTH_FULL[mo]}</td>
                          <td style={{padding:"10px 16px",textAlign:"center",color:"#166534",fontWeight:700}}>{hasData?t.a:"—"}</td>
                          <td style={{padding:"10px 16px",textAlign:"center",color:"#991b1b",fontWeight:700}}>{hasData?t.b:"—"}</td>
                          <td style={{padding:"10px 16px",textAlign:"center",color:"#92400e",fontWeight:700}}>{hasData?t.c:"—"}</td>
                          {selectedYear>=2021 && <>
                            <td style={{padding:"10px 16px",textAlign:"center",color:"#475569"}}>{hasData?(t.lbb||"—"):"—"}</td>
                            <td style={{padding:"10px 16px",textAlign:"center",color:"#475569"}}>{hasData?(t.cb||"—"):"—"}</td>
                            <td style={{padding:"10px 16px",textAlign:"center",color:"#475569"}}>{hasData?(t.ground||"—"):"—"}</td>
                          </>}
                          <td style={{padding:"10px 16px",textAlign:"center",fontWeight:700,color:NB_BLUE}}>{hasData?total:"—"}</td>
                        </tr>
                      );
                    })}
                    {/* Year total row */}
                    {(()=>{
                      const yt = getYearTotals(selectedYear);
                      const total = yt.a+yt.b+yt.c;
                      return (
                        <tr style={{background:NB_BLUE,color:"white"}}>
                          <td style={{padding:"12px 16px",fontWeight:800,fontSize:14}}>YEAR TOTAL</td>
                          <td style={{padding:"12px 16px",textAlign:"center",fontWeight:800,fontSize:14}}>{yt.a}</td>
                          <td style={{padding:"12px 16px",textAlign:"center",fontWeight:800,fontSize:14}}>{yt.b}</td>
                          <td style={{padding:"12px 16px",textAlign:"center",fontWeight:800,fontSize:14}}>{yt.c}</td>
                          {selectedYear>=2021 && <>
                            <td style={{padding:"12px 16px",textAlign:"center",fontWeight:800,fontSize:14}}>{yt.lbb||0}</td>
                            <td style={{padding:"12px 16px",textAlign:"center",fontWeight:800,fontSize:14}}>{yt.cb||0}</td>
                            <td style={{padding:"12px 16px",textAlign:"center",fontWeight:800,fontSize:14}}>{yt.ground||0}</td>
                          </>}
                          <td style={{padding:"12px 16px",textAlign:"center",fontWeight:800,fontSize:14}}>{total}</td>
                        </tr>
                      );
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function TotalsCard({totals, label, showDisp}) {
  const total = totals.a + totals.b + totals.c;
  return (
    <div style={{background:"white",borderRadius:10,border:"1px solid #38bdf8",padding:20,boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
      <div style={{fontWeight:700,fontSize:14,color:"#64748b",marginBottom:14,textTransform:"uppercase",letterSpacing:"0.5px"}}>{label}</div>
      <div style={{display:"grid",gridTemplateColumns:`repeat(${showDisp?6:3},1fr)`,gap:12}}>
        <StatBox value={totals.a} label="Renewed" color="#166534" bg="#dcfce7"/>
        <StatBox value={totals.b} label="Returned" color="#991b1b" bg="#fee2e2"/>
        <StatBox value={totals.c} label="Purchased" color="#92400e" bg="#fef3c7"/>
        {showDisp && <>
          <StatBox value={totals.lbb||0} label="LBB" color="#1e40af" bg="#dbeafe"/>
          <StatBox value={totals.cb||0} label="CB" color="#5b21b6" bg="#ede9fe"/>
          <StatBox value={totals.ground||0} label="Ground" color="#475569" bg="#f1f5f9"/>
        </>}
      </div>
      <div style={{marginTop:12,paddingTop:12,borderTop:"1px solid #f1f5f9",display:"flex",gap:8,alignItems:"center"}}>
        <span style={{fontSize:12,color:"#94a3b8"}}>Total:</span>
        <span style={{fontSize:18,fontWeight:800,color:"#1e293b"}}>{total}</span>
        {total > 0 && <span style={{fontSize:12,color:"#94a3b8",marginLeft:8}}>
          {Math.round(totals.a/total*100)}% Renewed · {Math.round(totals.b/total*100)}% Returned · {Math.round(totals.c/total*100)}% Purchased
        </span>}
      </div>
    </div>
  );
}

function StatBox({value, label, color, bg}) {
  return (
    <div style={{background:bg,borderRadius:8,padding:"12px 14px",textAlign:"center"}}>
      <div style={{fontSize:26,fontWeight:800,color,lineHeight:1}}>{value}</div>
      <div style={{fontSize:11,fontWeight:600,color,marginTop:4,textTransform:"uppercase",letterSpacing:"0.5px"}}>{label}</div>
    </div>
  );
}

function ReportTotalsTable({label, totals, showDisp}) {
  const total = totals.a+totals.b+totals.c;
  return (
    <div>
      <div style={{fontWeight:700,fontSize:13,color:"#64748b",marginBottom:8,textTransform:"uppercase",letterSpacing:"0.5px"}}>{label}</div>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13,border:"1px solid #38bdf8",borderRadius:8,overflow:"hidden"}}>
        <thead>
          <tr style={{background:"#f8fafc"}}>
            <th style={{padding:"8px 14px",textAlign:"left",fontWeight:600,color:"#64748b",borderBottom:"1px solid #e2e8f0"}}>Renewed (A)</th>
            <th style={{padding:"8px 14px",textAlign:"left",fontWeight:600,color:"#64748b",borderBottom:"1px solid #e2e8f0"}}>Returned (B)</th>
            <th style={{padding:"8px 14px",textAlign:"left",fontWeight:600,color:"#64748b",borderBottom:"1px solid #e2e8f0"}}>Purchased (C)</th>
            {showDisp && <>
              <th style={{padding:"8px 14px",textAlign:"left",fontWeight:600,color:"#64748b",borderBottom:"1px solid #e2e8f0"}}>LBB</th>
              <th style={{padding:"8px 14px",textAlign:"left",fontWeight:600,color:"#64748b",borderBottom:"1px solid #e2e8f0"}}>CB</th>
              <th style={{padding:"8px 14px",textAlign:"left",fontWeight:600,color:"#64748b",borderBottom:"1px solid #e2e8f0"}}>Ground</th>
            </>}
            <th style={{padding:"8px 14px",textAlign:"left",fontWeight:600,color:"#64748b",borderBottom:"1px solid #e2e8f0"}}>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{padding:"10px 14px",fontWeight:700,color:"#166534",fontSize:16}}>{totals.a}</td>
            <td style={{padding:"10px 14px",fontWeight:700,color:"#991b1b",fontSize:16}}>{totals.b}</td>
            <td style={{padding:"10px 14px",fontWeight:700,color:"#92400e",fontSize:16}}>{totals.c}</td>
            {showDisp && <>
              <td style={{padding:"10px 14px",fontWeight:600,color:"#1e40af"}}>{totals.lbb||0}</td>
              <td style={{padding:"10px 14px",fontWeight:600,color:"#5b21b6"}}>{totals.cb||0}</td>
              <td style={{padding:"10px 14px",fontWeight:600,color:"#475569"}}>{totals.ground||0}</td>
            </>}
            <td style={{padding:"10px 14px",fontWeight:800,color:"#1e293b",fontSize:16}}>{total}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
