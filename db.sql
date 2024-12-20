PGDMP                         |            realtime_chat_application    12.12    12.12     "           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            #           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            $           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            %           1262    200919    realtime_chat_application    DATABASE     �   CREATE DATABASE realtime_chat_application WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'English_India.1252' LC_CTYPE = 'English_India.1252';
 )   DROP DATABASE realtime_chat_application;
                postgres    false                        2615    200920    chat    SCHEMA        CREATE SCHEMA chat;
    DROP SCHEMA chat;
                postgres    false            �            1259    209165    messages    TABLE     �   CREATE TABLE chat.messages (
    id integer NOT NULL,
    sender_id character varying(50) NOT NULL,
    recipient_id character varying(50) NOT NULL,
    text text NOT NULL,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE chat.messages;
       chat         heap    postgres    false    4            �            1259    209163    messages_id_seq    SEQUENCE     �   CREATE SEQUENCE chat.messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE chat.messages_id_seq;
       chat          postgres    false    209    4            &           0    0    messages_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE chat.messages_id_seq OWNED BY chat.messages.id;
          chat          postgres    false    208            �            1259    200940    otp_management    TABLE     �   CREATE TABLE chat.otp_management (
    email character varying(50),
    otp integer,
    created_time timestamp(6) with time zone
);
     DROP TABLE chat.otp_management;
       chat         heap    postgres    false    4            �            1259    200963    request_table    TABLE     �   CREATE TABLE chat.request_table (
    request_id integer NOT NULL,
    sender_id character varying(30),
    recipient_id character varying(30),
    status character varying(30),
    created_at time(6) with time zone
);
    DROP TABLE chat.request_table;
       chat         heap    postgres    false    4            �            1259    200961    request_table_request_id_seq    SEQUENCE     �   CREATE SEQUENCE chat.request_table_request_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 1   DROP SEQUENCE chat.request_table_request_id_seq;
       chat          postgres    false    4    207            '           0    0    request_table_request_id_seq    SEQUENCE OWNED BY     Y   ALTER SEQUENCE chat.request_table_request_id_seq OWNED BY chat.request_table.request_id;
          chat          postgres    false    206            �            1259    200934    user_details    TABLE     T  CREATE TABLE chat.user_details (
    uid integer NOT NULL,
    email character varying(30),
    password character varying(100),
    user_id character varying(30),
    created_time time(6) with time zone,
    profile_pic character varying(100),
    name character varying(50),
    join_flag integer,
    chat_status character varying(1)
);
    DROP TABLE chat.user_details;
       chat         heap    postgres    false    4            �            1259    200932    user_details_uid_seq    SEQUENCE     �   CREATE SEQUENCE chat.user_details_uid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE chat.user_details_uid_seq;
       chat          postgres    false    4    204            (           0    0    user_details_uid_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE chat.user_details_uid_seq OWNED BY chat.user_details.uid;
          chat          postgres    false    203            �
           2604    209168    messages id    DEFAULT     f   ALTER TABLE ONLY chat.messages ALTER COLUMN id SET DEFAULT nextval('chat.messages_id_seq'::regclass);
 8   ALTER TABLE chat.messages ALTER COLUMN id DROP DEFAULT;
       chat          postgres    false    209    208    209            �
           2604    200966    request_table request_id    DEFAULT     �   ALTER TABLE ONLY chat.request_table ALTER COLUMN request_id SET DEFAULT nextval('chat.request_table_request_id_seq'::regclass);
 E   ALTER TABLE chat.request_table ALTER COLUMN request_id DROP DEFAULT;
       chat          postgres    false    206    207    207            �
           2604    200937    user_details uid    DEFAULT     p   ALTER TABLE ONLY chat.user_details ALTER COLUMN uid SET DEFAULT nextval('chat.user_details_uid_seq'::regclass);
 =   ALTER TABLE chat.user_details ALTER COLUMN uid DROP DEFAULT;
       chat          postgres    false    203    204    204                      0    209165    messages 
   TABLE DATA           P   COPY chat.messages (id, sender_id, recipient_id, text, "timestamp") FROM stdin;
    chat          postgres    false    209   "                 0    200940    otp_management 
   TABLE DATA           @   COPY chat.otp_management (email, otp, created_time) FROM stdin;
    chat          postgres    false    205   I                  0    200963    request_table 
   TABLE DATA           ^   COPY chat.request_table (request_id, sender_id, recipient_id, status, created_at) FROM stdin;
    chat          postgres    false    207   �                  0    200934    user_details 
   TABLE DATA           |   COPY chat.user_details (uid, email, password, user_id, created_time, profile_pic, name, join_flag, chat_status) FROM stdin;
    chat          postgres    false    204   !       )           0    0    messages_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('chat.messages_id_seq', 20, true);
          chat          postgres    false    208            *           0    0    request_table_request_id_seq    SEQUENCE SET     I   SELECT pg_catalog.setval('chat.request_table_request_id_seq', 25, true);
          chat          postgres    false    206            +           0    0    user_details_uid_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('chat.user_details_uid_seq', 8, true);
          chat          postgres    false    203            �
           2606    209174    messages messages_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY chat.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY chat.messages DROP CONSTRAINT messages_pkey;
       chat            postgres    false    209            �
           2606    200968     request_table request_table_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY chat.request_table
    ADD CONSTRAINT request_table_pkey PRIMARY KEY (request_id);
 H   ALTER TABLE ONLY chat.request_table DROP CONSTRAINT request_table_pkey;
       chat            postgres    false    207            �
           2606    200939    user_details user_details_pkey 
   CONSTRAINT     [   ALTER TABLE ONLY chat.user_details
    ADD CONSTRAINT user_details_pkey PRIMARY KEY (uid);
 F   ALTER TABLE ONLY chat.user_details DROP CONSTRAINT user_details_pkey;
       chat            postgres    false    204                 x���KN�0�u}�^`,۱�ڌF\�M��J#���@Y4������7��{�0}��MS'$zb9���مl	�1�֮�eI������}n��,����jc|Y18k:�ð���,�<������<N;<�g��Ƙ?�����:����%�B�=7s��h�!m�6�)ӡ�]��|�J�r�h��V�X:��6�(�vG���w���(�Yђ�3�Tj,՜p�>%I	��������]�������X�m%Mم�@h�ҽ��բ�%�#�'c}ڃ         N   x�K�K�K�(-��J�L�300tH�M���K���45037��4202�54�54T00�2��26�364340�5������� ���         N   x�32�tv4400�P����ɩ%�)�FVƆVƦz&&�F��\F&UF0=��V�V��zƖ���f �1z\\\ ���         \  x�e�KS�0 �s�;��Nړ��00"�"�p	M���@K���;�ř��+�6��Ӣ�t��OI��F��ȶ�Q�k2���aǳy4[��I��fn���q��5Y2���mx)�e3�!|��xTxAW2&�$o��F�o)�1���53s�9��V(�;���.��f�H�dUV��.O�N]�_��N�I���kó�6G�r��>���d���U.^�qN&�� �<,<�B*�`�)`#�,�JJC6�cC�KbFbk;e��
�R�&m��N������\F�蜘r���q<|\����|���pz�Q��eEWCe+=�
eˎI�g2�qō%䝹����@�q~ ���     