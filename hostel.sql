PGDMP                       }            postgres    17.4    17.4 F    q           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            r           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            s           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            t           1262    5    postgres    DATABASE     �   CREATE DATABASE postgres WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
    DROP DATABASE postgres;
                     postgres    false            u           0    0    DATABASE postgres    COMMENT     N   COMMENT ON DATABASE postgres IS 'default administrative connection database';
                        postgres    false    4980                        2615    25204    hostel    SCHEMA        CREATE SCHEMA hostel;
    DROP SCHEMA hostel;
                     postgres    false            �            1259    25268    bill    TABLE     H  CREATE TABLE hostel.bill (
    bill_id integer NOT NULL,
    room_id character varying(10),
    billing_month date NOT NULL,
    electricity_fee numeric(10,2) NOT NULL,
    water_fee numeric(10,2) NOT NULL,
    internet_fee numeric(10,2) NOT NULL,
    total_fee numeric(10,2) GENERATED ALWAYS AS (((electricity_fee + water_fee) + internet_fee)) STORED,
    payment_status character varying(20) NOT NULL,
    CONSTRAINT bill_payment_status_check CHECK (((payment_status)::text = ANY ((ARRAY['Chưa thanh toán'::character varying, 'Đã thanh toán'::character varying])::text[])))
);
    DROP TABLE hostel.bill;
       hostel         heap r       postgres    false    6            �            1259    25267    bill_bill_id_seq    SEQUENCE     �   CREATE SEQUENCE hostel.bill_bill_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE hostel.bill_bill_id_seq;
       hostel               postgres    false    242    6            v           0    0    bill_bill_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE hostel.bill_bill_id_seq OWNED BY hostel.bill.bill_id;
          hostel               postgres    false    241            �            1259    25206    building    TABLE     u   CREATE TABLE hostel.building (
    building_id integer NOT NULL,
    building_name character varying(10) NOT NULL
);
    DROP TABLE hostel.building;
       hostel         heap r       postgres    false    6            �            1259    25205    building_building_id_seq    SEQUENCE     �   CREATE SEQUENCE hostel.building_building_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE hostel.building_building_id_seq;
       hostel               postgres    false    233    6            w           0    0    building_building_id_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE hostel.building_building_id_seq OWNED BY hostel.building.building_id;
          hostel               postgres    false    232            �            1259    25242    employee    TABLE     A  CREATE TABLE hostel.employee (
    employee_id integer NOT NULL,
    name character varying(100) NOT NULL,
    sex character varying(10) NOT NULL,
    salary numeric(10,2) NOT NULL,
    contact_no character varying(15) NOT NULL,
    email character varying(100) NOT NULL,
    "position" character varying(50) NOT NULL
);
    DROP TABLE hostel.employee;
       hostel         heap r       postgres    false    6            �            1259    25241    employee_employee_id_seq    SEQUENCE     �   CREATE SEQUENCE hostel.employee_employee_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE hostel.employee_employee_id_seq;
       hostel               postgres    false    238    6            x           0    0    employee_employee_id_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE hostel.employee_employee_id_seq OWNED BY hostel.employee.employee_id;
          hostel               postgres    false    237            �            1259    25282    maintenance_request    TABLE     �  CREATE TABLE hostel.maintenance_request (
    request_id integer NOT NULL,
    room_id character varying(10),
    description text NOT NULL,
    request_date date DEFAULT CURRENT_DATE NOT NULL,
    status character varying(20) DEFAULT 'Chưa xử lý'::character varying NOT NULL,
    CONSTRAINT maintenance_request_status_check CHECK (((status)::text = ANY ((ARRAY['Chưa xử lý'::character varying, 'Đã xử lý'::character varying])::text[])))
);
 '   DROP TABLE hostel.maintenance_request;
       hostel         heap r       postgres    false    6            �            1259    25281 "   maintenance_request_request_id_seq    SEQUENCE     �   CREATE SEQUENCE hostel.maintenance_request_request_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 9   DROP SEQUENCE hostel.maintenance_request_request_id_seq;
       hostel               postgres    false    244    6            y           0    0 "   maintenance_request_request_id_seq    SEQUENCE OWNED BY     i   ALTER SEQUENCE hostel.maintenance_request_request_id_seq OWNED BY hostel.maintenance_request.request_id;
          hostel               postgres    false    243            �            1259    25214    room    TABLE       CREATE TABLE hostel.room (
    room_id character varying(10) NOT NULL,
    building_id integer,
    room_number character varying(10) NOT NULL,
    capacity integer NOT NULL,
    current_occupants integer NOT NULL,
    CONSTRAINT room_check CHECK ((current_occupants <= capacity))
);
    DROP TABLE hostel.room;
       hostel         heap r       postgres    false    6            �            1259    25251    room_contract    TABLE     �   CREATE TABLE hostel.room_contract (
    contract_id integer NOT NULL,
    student_id integer,
    room_id character varying(10),
    start_date date NOT NULL,
    end_date date NOT NULL,
    rent_fee numeric(10,2) NOT NULL
);
 !   DROP TABLE hostel.room_contract;
       hostel         heap r       postgres    false    6            �            1259    25250    room_contract_contract_id_seq    SEQUENCE     �   CREATE SEQUENCE hostel.room_contract_contract_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 4   DROP SEQUENCE hostel.room_contract_contract_id_seq;
       hostel               postgres    false    6    240            z           0    0    room_contract_contract_id_seq    SEQUENCE OWNED BY     _   ALTER SEQUENCE hostel.room_contract_contract_id_seq OWNED BY hostel.room_contract.contract_id;
          hostel               postgres    false    239            �            1259    25226    student    TABLE       CREATE TABLE hostel.student (
    student_id integer NOT NULL,
    name character varying(100) NOT NULL,
    dob date NOT NULL,
    room_id character varying(10),
    contact_no character varying(15) NOT NULL,
    email character varying(100) NOT NULL,
    address text NOT NULL
);
    DROP TABLE hostel.student;
       hostel         heap r       postgres    false    6            �            1259    25225    student_student_id_seq    SEQUENCE     �   CREATE SEQUENCE hostel.student_student_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE hostel.student_student_id_seq;
       hostel               postgres    false    236    6            {           0    0    student_student_id_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE hostel.student_student_id_seq OWNED BY hostel.student.student_id;
          hostel               postgres    false    235            �            1259    25299    user_account    TABLE     }  CREATE TABLE hostel.user_account (
    user_id integer NOT NULL,
    username character varying(50) NOT NULL,
    password text NOT NULL,
    role character varying(20) NOT NULL,
    related_id integer,
    CONSTRAINT user_account_role_check CHECK (((role)::text = ANY ((ARRAY['Admin'::character varying, 'Student'::character varying, 'Employee'::character varying])::text[])))
);
     DROP TABLE hostel.user_account;
       hostel         heap r       postgres    false    6            �            1259    25298    user_account_user_id_seq    SEQUENCE     �   CREATE SEQUENCE hostel.user_account_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE hostel.user_account_user_id_seq;
       hostel               postgres    false    246    6            |           0    0    user_account_user_id_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE hostel.user_account_user_id_seq OWNED BY hostel.user_account.user_id;
          hostel               postgres    false    245            �           2604    25271    bill bill_id    DEFAULT     l   ALTER TABLE ONLY hostel.bill ALTER COLUMN bill_id SET DEFAULT nextval('hostel.bill_bill_id_seq'::regclass);
 ;   ALTER TABLE hostel.bill ALTER COLUMN bill_id DROP DEFAULT;
       hostel               postgres    false    242    241    242            �           2604    25209    building building_id    DEFAULT     |   ALTER TABLE ONLY hostel.building ALTER COLUMN building_id SET DEFAULT nextval('hostel.building_building_id_seq'::regclass);
 C   ALTER TABLE hostel.building ALTER COLUMN building_id DROP DEFAULT;
       hostel               postgres    false    232    233    233            �           2604    25245    employee employee_id    DEFAULT     |   ALTER TABLE ONLY hostel.employee ALTER COLUMN employee_id SET DEFAULT nextval('hostel.employee_employee_id_seq'::regclass);
 C   ALTER TABLE hostel.employee ALTER COLUMN employee_id DROP DEFAULT;
       hostel               postgres    false    237    238    238            �           2604    25285    maintenance_request request_id    DEFAULT     �   ALTER TABLE ONLY hostel.maintenance_request ALTER COLUMN request_id SET DEFAULT nextval('hostel.maintenance_request_request_id_seq'::regclass);
 M   ALTER TABLE hostel.maintenance_request ALTER COLUMN request_id DROP DEFAULT;
       hostel               postgres    false    244    243    244            �           2604    25254    room_contract contract_id    DEFAULT     �   ALTER TABLE ONLY hostel.room_contract ALTER COLUMN contract_id SET DEFAULT nextval('hostel.room_contract_contract_id_seq'::regclass);
 H   ALTER TABLE hostel.room_contract ALTER COLUMN contract_id DROP DEFAULT;
       hostel               postgres    false    240    239    240            �           2604    25229    student student_id    DEFAULT     x   ALTER TABLE ONLY hostel.student ALTER COLUMN student_id SET DEFAULT nextval('hostel.student_student_id_seq'::regclass);
 A   ALTER TABLE hostel.student ALTER COLUMN student_id DROP DEFAULT;
       hostel               postgres    false    236    235    236            �           2604    25302    user_account user_id    DEFAULT     |   ALTER TABLE ONLY hostel.user_account ALTER COLUMN user_id SET DEFAULT nextval('hostel.user_account_user_id_seq'::regclass);
 C   ALTER TABLE hostel.user_account ALTER COLUMN user_id DROP DEFAULT;
       hostel               postgres    false    246    245    246            j          0    25268    bill 
   TABLE DATA           y   COPY hostel.bill (bill_id, room_id, billing_month, electricity_fee, water_fee, internet_fee, payment_status) FROM stdin;
    hostel               postgres    false    242   �Y       a          0    25206    building 
   TABLE DATA           >   COPY hostel.building (building_id, building_name) FROM stdin;
    hostel               postgres    false    233   YZ       f          0    25242    employee 
   TABLE DATA           a   COPY hostel.employee (employee_id, name, sex, salary, contact_no, email, "position") FROM stdin;
    hostel               postgres    false    238   �Z       l          0    25282    maintenance_request 
   TABLE DATA           e   COPY hostel.maintenance_request (request_id, room_id, description, request_date, status) FROM stdin;
    hostel               postgres    false    244   [       b          0    25214    room 
   TABLE DATA           ^   COPY hostel.room (room_id, building_id, room_number, capacity, current_occupants) FROM stdin;
    hostel               postgres    false    234   ~[       h          0    25251    room_contract 
   TABLE DATA           i   COPY hostel.room_contract (contract_id, student_id, room_id, start_date, end_date, rent_fee) FROM stdin;
    hostel               postgres    false    240   �[       d          0    25226    student 
   TABLE DATA           ]   COPY hostel.student (student_id, name, dob, room_id, contact_no, email, address) FROM stdin;
    hostel               postgres    false    236   -\       n          0    25299    user_account 
   TABLE DATA           U   COPY hostel.user_account (user_id, username, password, role, related_id) FROM stdin;
    hostel               postgres    false    246   �\       }           0    0    bill_bill_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('hostel.bill_bill_id_seq', 3, true);
          hostel               postgres    false    241            ~           0    0    building_building_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('hostel.building_building_id_seq', 4, true);
          hostel               postgres    false    232                       0    0    employee_employee_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('hostel.employee_employee_id_seq', 2, true);
          hostel               postgres    false    237            �           0    0 "   maintenance_request_request_id_seq    SEQUENCE SET     P   SELECT pg_catalog.setval('hostel.maintenance_request_request_id_seq', 2, true);
          hostel               postgres    false    243            �           0    0    room_contract_contract_id_seq    SEQUENCE SET     K   SELECT pg_catalog.setval('hostel.room_contract_contract_id_seq', 3, true);
          hostel               postgres    false    239            �           0    0    student_student_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('hostel.student_student_id_seq', 3, true);
          hostel               postgres    false    235            �           0    0    user_account_user_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('hostel.user_account_user_id_seq', 4, true);
          hostel               postgres    false    245            �           2606    25275    bill bill_pkey 
   CONSTRAINT     Q   ALTER TABLE ONLY hostel.bill
    ADD CONSTRAINT bill_pkey PRIMARY KEY (bill_id);
 8   ALTER TABLE ONLY hostel.bill DROP CONSTRAINT bill_pkey;
       hostel                 postgres    false    242            �           2606    25213 #   building building_building_name_key 
   CONSTRAINT     g   ALTER TABLE ONLY hostel.building
    ADD CONSTRAINT building_building_name_key UNIQUE (building_name);
 M   ALTER TABLE ONLY hostel.building DROP CONSTRAINT building_building_name_key;
       hostel                 postgres    false    233            �           2606    25211    building building_pkey 
   CONSTRAINT     ]   ALTER TABLE ONLY hostel.building
    ADD CONSTRAINT building_pkey PRIMARY KEY (building_id);
 @   ALTER TABLE ONLY hostel.building DROP CONSTRAINT building_pkey;
       hostel                 postgres    false    233            �           2606    25249    employee employee_email_key 
   CONSTRAINT     W   ALTER TABLE ONLY hostel.employee
    ADD CONSTRAINT employee_email_key UNIQUE (email);
 E   ALTER TABLE ONLY hostel.employee DROP CONSTRAINT employee_email_key;
       hostel                 postgres    false    238            �           2606    25247    employee employee_pkey 
   CONSTRAINT     ]   ALTER TABLE ONLY hostel.employee
    ADD CONSTRAINT employee_pkey PRIMARY KEY (employee_id);
 @   ALTER TABLE ONLY hostel.employee DROP CONSTRAINT employee_pkey;
       hostel                 postgres    false    238            �           2606    25292 ,   maintenance_request maintenance_request_pkey 
   CONSTRAINT     r   ALTER TABLE ONLY hostel.maintenance_request
    ADD CONSTRAINT maintenance_request_pkey PRIMARY KEY (request_id);
 V   ALTER TABLE ONLY hostel.maintenance_request DROP CONSTRAINT maintenance_request_pkey;
       hostel                 postgres    false    244            �           2606    25256     room_contract room_contract_pkey 
   CONSTRAINT     g   ALTER TABLE ONLY hostel.room_contract
    ADD CONSTRAINT room_contract_pkey PRIMARY KEY (contract_id);
 J   ALTER TABLE ONLY hostel.room_contract DROP CONSTRAINT room_contract_pkey;
       hostel                 postgres    false    240            �           2606    25219    room room_pkey 
   CONSTRAINT     Q   ALTER TABLE ONLY hostel.room
    ADD CONSTRAINT room_pkey PRIMARY KEY (room_id);
 8   ALTER TABLE ONLY hostel.room DROP CONSTRAINT room_pkey;
       hostel                 postgres    false    234            �           2606    25235    student student_email_key 
   CONSTRAINT     U   ALTER TABLE ONLY hostel.student
    ADD CONSTRAINT student_email_key UNIQUE (email);
 C   ALTER TABLE ONLY hostel.student DROP CONSTRAINT student_email_key;
       hostel                 postgres    false    236            �           2606    25233    student student_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY hostel.student
    ADD CONSTRAINT student_pkey PRIMARY KEY (student_id);
 >   ALTER TABLE ONLY hostel.student DROP CONSTRAINT student_pkey;
       hostel                 postgres    false    236            �           2606    25307    user_account user_account_pkey 
   CONSTRAINT     a   ALTER TABLE ONLY hostel.user_account
    ADD CONSTRAINT user_account_pkey PRIMARY KEY (user_id);
 H   ALTER TABLE ONLY hostel.user_account DROP CONSTRAINT user_account_pkey;
       hostel                 postgres    false    246            �           2606    25309 &   user_account user_account_username_key 
   CONSTRAINT     e   ALTER TABLE ONLY hostel.user_account
    ADD CONSTRAINT user_account_username_key UNIQUE (username);
 P   ALTER TABLE ONLY hostel.user_account DROP CONSTRAINT user_account_username_key;
       hostel                 postgres    false    246            �           2606    25276    bill bill_room_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY hostel.bill
    ADD CONSTRAINT bill_room_id_fkey FOREIGN KEY (room_id) REFERENCES hostel.room(room_id) ON DELETE CASCADE;
 @   ALTER TABLE ONLY hostel.bill DROP CONSTRAINT bill_room_id_fkey;
       hostel               postgres    false    4788    242    234            �           2606    25315    user_account fk_employee    FK CONSTRAINT     �   ALTER TABLE ONLY hostel.user_account
    ADD CONSTRAINT fk_employee FOREIGN KEY (related_id) REFERENCES hostel.employee(employee_id) ON DELETE CASCADE;
 B   ALTER TABLE ONLY hostel.user_account DROP CONSTRAINT fk_employee;
       hostel               postgres    false    246    238    4796            �           2606    25310    user_account fk_student    FK CONSTRAINT     �   ALTER TABLE ONLY hostel.user_account
    ADD CONSTRAINT fk_student FOREIGN KEY (related_id) REFERENCES hostel.student(student_id) ON DELETE CASCADE;
 A   ALTER TABLE ONLY hostel.user_account DROP CONSTRAINT fk_student;
       hostel               postgres    false    4792    246    236            �           2606    25293 4   maintenance_request maintenance_request_room_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY hostel.maintenance_request
    ADD CONSTRAINT maintenance_request_room_id_fkey FOREIGN KEY (room_id) REFERENCES hostel.room(room_id) ON DELETE CASCADE;
 ^   ALTER TABLE ONLY hostel.maintenance_request DROP CONSTRAINT maintenance_request_room_id_fkey;
       hostel               postgres    false    244    4788    234            �           2606    25220    room room_building_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY hostel.room
    ADD CONSTRAINT room_building_id_fkey FOREIGN KEY (building_id) REFERENCES hostel.building(building_id) ON DELETE CASCADE;
 D   ALTER TABLE ONLY hostel.room DROP CONSTRAINT room_building_id_fkey;
       hostel               postgres    false    233    4786    234            �           2606    25262 (   room_contract room_contract_room_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY hostel.room_contract
    ADD CONSTRAINT room_contract_room_id_fkey FOREIGN KEY (room_id) REFERENCES hostel.room(room_id) ON DELETE CASCADE;
 R   ALTER TABLE ONLY hostel.room_contract DROP CONSTRAINT room_contract_room_id_fkey;
       hostel               postgres    false    240    234    4788            �           2606    25257 +   room_contract room_contract_student_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY hostel.room_contract
    ADD CONSTRAINT room_contract_student_id_fkey FOREIGN KEY (student_id) REFERENCES hostel.student(student_id) ON DELETE CASCADE;
 U   ALTER TABLE ONLY hostel.room_contract DROP CONSTRAINT room_contract_student_id_fkey;
       hostel               postgres    false    236    240    4792            �           2606    25236    student student_room_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY hostel.student
    ADD CONSTRAINT student_room_id_fkey FOREIGN KEY (room_id) REFERENCES hostel.room(room_id) ON DELETE SET NULL;
 F   ALTER TABLE ONLY hostel.student DROP CONSTRAINT student_room_id_fkey;
       hostel               postgres    false    234    236    4788            j   _   x�3�t440�4202�50�2M@@�� (c��X��6$*�d$�e(��^��e��d�j�	B��	G&^�b�1��1��X,64�i@� ��0�      a      x�3�t�2�t�2�t�2�t����� ��      f   x   x�3��K/�L�SK�S,M���K��44� =NKs3Sc#C�B��CF~qIj�^r~.g`��]��r��2��IU����JN����sZ �5�(�l�Ј|����۹b���� |_-�      l   `   x�3�t440��x��?/]!��f yd��y�FF��ƺ����6$*T<ܽV!��^.#N'#����' ���p��d��Û���ģ/F��� �\+�      b   J   x�%���0���
8����"KH�-/��9KX
e6n�W�loM�2���wnB���;��$7�����u*      h   E   x�]��	�@C�u^/3��m���&��8DQ0�j|)��I�a�n�EzoWZf���=����	      d   �   x�]�1�@@�z�{�%3��B'���R+�	R�$
��W���/��l�O�E��A�Ē�L�31P��6~�KA�㽉CR�O8j�;85�zt��cg)�졐	/6���q8����9�g+�Mx��[ლRc���H�0#      n   _   x�3�LL��̃��FƜ�`n��gqIiJj^����!gAbq1H:"�i�e�w2�ʛ���卸L8s��S�a�N�܂����T�	1z\\\ �&�     