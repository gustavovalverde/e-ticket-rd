# Dominican Republic E-Ticket System - Current Implementation Documentation

This document provides detailed documentation of the existing Dominican Republic E-Ticket system screens and fields.

## System URL

<https://eticket.migracion.gob.do/>

## Screen Flow Documentation

### 1. Landing Page (`01-landing.png`)

**Purpose**: The initial entry point for travelers, providing access to new applications and consultations of existing e-tickets.

**Key Elements**:

- **Header**:
  - "E-TICKET REPUBLICA DOMINICANA" logo with the national coat of arms.
  - Language selector dropdown, shown with "ENGLISH" selected.
- **Primary Headline**: "Welcome to the Electronic Ticket portal for entering and leaving the Dominican Republic".
- **Primary Actions**:
  - `E-TICKET APPLICATION` button.
  - `CONSULT E-TICKET` button.
- **Informational Section**:
  - Title: "WHAT IS THE ELECTRONIC TICKET ?"
  - Description: Explains the E-Ticket is a mandatory digital form for Immigration, Customs, and Public Health, citing Dominican laws (285-04, 115-17, 72-02, 226-06).
  - Link: A button to the "Viajero Digital" page.
- **Footer/Misc**:
  - A chat support icon is present on the bottom right.

### 2. New E-Ticket Creation (`02-new-eticket.png`)

**Purpose**: The first step in the e-ticket application process, where the user agrees to the terms and confirms they are not a robot before proceeding.

**Key Elements**:

- **Form Title**: "SOLICITUD DE E-TICKET" (E-Ticket Application).
- **Instructions & Notices**:
  - **Mandatory Fields**: A notice states that fields marked with a red asterisk `(*)` are mandatory.
  - **Traveler's Manual**: A link to download the "MANUAL DEL VIAJERO (VER AQUÍ)".
  - **Group Travel**: A toggle switch for "¿ESTA VIAJANDO ACOMPAÑADO DE ALGUIEN MÁS?" (Are you traveling with someone else?), defaulted to "NO".
  - **Aviso (Notice)**: An info box instructs the user to enter their passport number and nationality exactly as they appear on their passport.
- **Form Controls**:
  - **reCAPTCHA**: "No soy un robot" (I'm not a robot) checkbox.
- **Actions**:
  - `Solicitar` (Request/Submit) button.
  - `SALIR` (Exit) button.
- **Footer**: Displays logos for the Dominican Republic and the "DIRECCIÓN GENERAL DE MIGRACIÓN".

### 3. E-Ticket Options (`03-new-eticket-options.png`)

**Purpose**: This screen details the additional options that appear when a user indicates they are traveling in a group.

**Key Elements**:

- **Group Travel Toggle**: The toggle for "¿ESTA VIAJANDO ACOMPAÑADO DE ALGUIEN MÁS?" (Are you traveling with someone else?) is switched to "SI" (Yes).
- **Conditional Fields**: The following fields appear after enabling the group travel toggle:
  - **Number of Companions**:
    - **Label**: `¿CUÁNTAS PERSONAS LE ACOMPAÑAN?`
    - **Field Type**: Number Input. The screenshot shows "1" as the value.
    - **Helper Text**: "Indique el número de personas que viajan con usted" (Indicate the number of people traveling with you).
  - **Nature of the Group**:
    - **Label**: `NATURALEZA DEL GRUPO`
    - **Field Type**: Dropdown (Select).
    - **Options Visible**: "Amigos" (Friends), "Compañeros de trabajo" (Coworkers), "Familia" (Family), "Pareja" (Couple).

### 4. General Information - Part 1 (`04-general-info-1.png`)

**Purpose**: This is the first main data entry screen of the e-ticket form, capturing the user's permanent residence and basic travel type (entry/departure).

**Key Elements**:

- **Application Code**: A unique code (`CÓDIGO DE APLICACIÓN: CM2HIQ`) is prominently displayed, which the user needs to access the form later.
- **Progress Stepper**: A 3-step indicator shows the user is on step 1, "INFORMACIÓN GENERAL". The next steps are "INFORMACIÓN MIGRATORIA" and "INFORMACIÓN ADUANAL".
- **Form Fields**:
  - `DIRECCIÓN PERMANENTE / RESIDENCIA *`: Required text input for the user's address.
  - `PAÍS DE RESIDENCIA *`: Required dropdown to select the country of residence.
  - `CIUDAD *`: Required dropdown, styled as a link, for city selection.
  - `ESTADO / (ex: New York)`: Optional text input for the state, with a placeholder example.
  - `CÓDIGO POSTAL`: Optional text input for the postal code.
  - `¿HACE ESCALAS EN OTROS PAÍSES?`: A toggle switch, defaulted to "NO".
  - `ENTRADA A LA REPUBLICA DOMINICANA` / `SALIDA DE LA REPUBLICA DOMINICANA`: A required radio button selection for specifying entry or departure.

### 5. Migratory Information (`05-general-info-2.png` & `06-general-info-2-1.png`)

**Purpose**: This is the main passenger information form, capturing personal details, passport data, and flight information.

**Key Elements**:

- **Header**: Displays "GOBIERNO DE LA REPÚBLICA DOMINICANA" and "MIGRACIÓN" logos.
- **Form Title**: "INFORMACIÓN MIGRATORIA".
- **Passenger Tab**: The form is presented under a tab for `PASAJERO PRINCIPAL` (Main Passenger).
- **Form Fields**:
  - **Personal Information**:
    - `NOMBRES *`: Required text input for first name(s).
    - `APELLIDOS *`: Required text input for last name(s).
    - `FECHA DE NACIMIENTO *`: Required date picker with `Año`, `Mes`, `Día` dropdowns.
    - `GÉNERO *`: Required dropdown.
    - `LUGAR DE NACIMIENTO *`: Required dropdown for country of birth.
    - `ESTADO CIVIL *`: Required dropdown for marital status.
    - `OCUPACIÓN *`: Required dropdown.
  - **Passport & Residency**:
    - `NÚMERO DE PASAPORTE *`: Required text input.
    - `CONFIRMAR PASAPORTE *`: Required text confirmation field for passport number.
    - `¿LA NACIONALIDAD DEL PASAPORTE ES DISTINTA A SU LUGAR DE NACIMIENTO?`: Toggle switch, defaults to `NO`.
    - `¿ES EXTRANJERO RESIDENTE EN LA REPÚBLICA DOMINICANA?`: Toggle switch, defaults to `NO`.
  - **Contact Information**:
    - `CORREO ELECTRÓNICO`: Optional email input.
    - `NÚMERO TELEFÓNICO`: Optional phone input with a country code selector.
  - **Flight Information**:
    - `PUERTO DE EMBARQUE *`: Required dropdown for port of embarkation.
    - `PUERTO DE DESEMBARQUE *`: Required dropdown for port of disembarkation.
    - `NOMBRE DE AEROLÍNEA *`: Required dropdown for airline.
    - `FECHA DE VUELO *`: Required date picker with `Año`, `Mes`, `Día` dropdowns.
    - `NÚMERO DE VUELO *`: Required text input for flight number.
    - `NÚMERO DE CONFIRMACIÓN DE VUELO / LOCALIZADOR / PNR`: Optional text input.
- **Actions**: `PASO ANTERIOR` (Previous Step) and `SIGUIENTE` (Next) buttons.

### 6. Customs Information (`07-migratory-info.png`)

**Purpose**: This is the final data entry screen, capturing the customs declaration for the main passenger.

**Key Elements**:

- **Progress Stepper**: The 3-step indicator shows the user is on the final step, "INFORMACIÓN ADUANAL".
- **Header**: Displays the "DGA ADUANAS" logo.
- **Form Title**: "INFORMACIÓN ADUANAL".
- **Passenger Context**: The name of the current passenger ("GUSTAVO VALVERDE") is displayed, indicating for whom the declaration is being made.
- **Declaration Fields**:
  - `¿Trae (n) o lleva (n) consigo... superior a US$10,000.00...?`: Toggle switch, defaults to `NO`.
  - `¿Trae consigo... animales vivos, plantas o productos alimenticios?`: Toggle switch, defaults to `NO`.
  - `¿Trae consigo... mercancías sujetas al pago de impuestos?`: Toggle switch, defaults to `NO`.
- **Legal Notices**: Two paragraphs detail customs allowances (up to $500 USD for gifts every 3 months) and the legal obligations of making a truthful declaration, citing Dominican laws (3489 and 155-17).
- **Actions**: `PASO ANTERIOR` (Previous Step) and `SIGUIENTE` (Next) buttons.

### 7. Final Step with QR Code (`08-final-step.png`)

**Purpose**: This is the final confirmation screen, displaying the successfully generated E-Ticket with all key information and a QR code for validation.

**Key Elements**:

- **Header**: Displays the official E-Ticket and Government/Migration logos.
- **E-Ticket Summary**:
  - `CÓDIGO DE APLICACIÓN`: A unique application code (e.g., KKYNKM).
  - `NOMBRES`: Full name of the passenger.
  - `NÚMERO DE PASAPORTE`: Passport number.
  - `PAÍS DE NACIONALIDAD`: Country of nationality.
  - `FECHA DE EMISIÓN`: Date of E-Ticket issuance.
  - `MIGRACIÓN`: Type of travel (e.g., ENTRADA).
  - `FECHA DE VUELO`: Date of the flight.
- **QR Code**: A large, scannable QR code is the central focus, with a note: "CÓDIGO QR DE USO EXCLUSIVO PARA VALIDACIÓN ADUANAL."
- **Flight Details**: A summary section at the bottom shows:
  - `NÚMERO DE VUELO`
  - `NOMBRE DE AEROLÍNEA`
- **Actions**: A final set of action buttons are available:
  - `SALIR` (Exit)
  - `Descargar PDF` (Download PDF)
  - `Enviar por correo electrónico` (Send by email)
  - `Modificar` (Modify)

## Field Inventory

| Screen                                     | Field Name                               | Field Type            | Required | Validation Rules | Notes                                                                                      |
| ------------------------------------------ | ---------------------------------------- | --------------------- | -------- | ---------------- | ------------------------------------------------------------------------------------------ |
| 3. E-Ticket Options                        | ¿Cuántas personas le acompañan?          | Number Input          | Yes      | -                | Appears if traveling with others.                                                          |
| 3. E-Ticket Options                        | Naturaleza del grupo                     | Dropdown              | Yes      | -                | Appears if traveling with others. Options: Amigos, Compañeros de trabajo, Familia, Pareja. |
| 4. General Info - Pt 1                     | Dirección Permanente / Residencia        | Text Input            | Yes      | -                | User's permanent address.                                                                  |
| 4. General Info - Pt 1                     | País de Residencia                       | Dropdown              | Yes      | -                | User's country of residence.                                                               |
| 4. General Info - Pt 1                     | Ciudad                                   | Dropdown (Link Style) | Yes      | -                | "CLIC AQUI PARA SELECCIONAR"                                                               |
| 4. General Info - Pt 1                     | Estado                                   | Text Input            | No       | -                | Placeholder: "(ex: New York)"                                                              |
| 4. General Info - Pt 1                     | Código Postal                            | Text Input            | No       | -                |                                                                                            |
| 4. General Info - Pt 1                     | ¿Hace escalas en otros países?           | Toggle Switch         | Yes      | -                | Defaults to "NO".                                                                          |
| 4. General Info - Pt 1                     | Entrada/Salida                           | Radio Buttons         | Yes      | -                | Choice between "ENTRADA" or "SALIDA".                                                      |
| 5. Migratory Info                          | Nombres                                  | Text Input            | Yes      | -                |                                                                                            |
| 5. Migratory Info                          | Apellidos                                | Text Input            | Yes      | -                |                                                                                            |
| 5. Migratory Info                          | Fecha de Nacimiento                      | Date Picker           | Yes      | -                | Dropdowns for Año, Mes, Día.                                                               |
| 5. Migratory Info                          | Género                                   | Dropdown              | Yes      | -                |                                                                                            |
| 5. Migratory Info                          | Lugar de Nacimiento                      | Dropdown              | Yes      | -                |                                                                                            |
| 5. Migratory Info                          | ¿La nacionalidad... es distinta...?      | Toggle Switch         | Yes      | -                | Defaults to NO.                                                                            |
| 5. Migratory Info                          | Número de Pasaporte                      | Text Input            | Yes      | -                |                                                                                            |
| 5. Migratory Info                          | Confirmar Pasaporte                      | Text Input            | Yes      | -                |                                                                                            |
| 5. Migratory Info                          | Estado Civil                             | Dropdown              | Yes      | -                |                                                                                            |
| 5. Migratory Info                          | Ocupación                                | Dropdown              | Yes      | -                |                                                                                            |
| 5. Migratory Info                          | Correo Electrónico                       | Email (Text)          | No       | -                |                                                                                            |
| 5. Migratory Info                          | Número Telefónico                        | Phone Input           | No       | -                | Includes country code selector.                                                            |
| 5. Migratory Info                          | ¿Es extranjero residente...?             | Toggle Switch         | Yes      | -                | Defaults to NO.                                                                            |
| 5. Migratory Info                          | Puerto de Embarque                       | Dropdown              | Yes      | -                |                                                                                            |
| 5. Migratory Info                          | Puerto de Desembarque                    | Dropdown              | Yes      | -                |                                                                                            |
| 5. Migratory Info                          | Nombre de Aerolínea                      | Dropdown              | Yes      | -                |                                                                                            |
| 5. Migratory Info                          | Fecha de Vuelo                           | Date Picker           | Yes      | -                | Dropdowns for Año, Mes, Día.                                                               |
| 5. Migratory Info                          | Número de Vuelo                          | Text Input            | Yes      | -                |                                                                                            |
| 5. Migratory Info                          | Número de Confirmación de Vuelo...       | Text Input            | No       | -                | PNR/Locator.                                                                               |
| 6. Customs Info                            | ¿Trae/Lleva... más de US$10,000?         | Toggle Switch         | Yes      | -                | Defaults to NO.                                                                            |
| 6. Customs Info                            | ¿Trae... animales, plantas, alimentos?   | Toggle Switch         | Yes      | -                | Defaults to NO.                                                                            |
| 6. Customs Info                            | ¿Trae... mercancías sujetas a impuestos? | Toggle Switch         | Yes      | -                | Defaults to NO.                                                                            |
| *To be populated based on screen analysis* |                                          |                       |          |                  |                                                                                            |

## Form Elements Catalog

### Input Types Observed

- Text Input
- Dropdown (Select)
- Date Picker (as 3 dropdowns)
- Radio Buttons
- Toggle Switch
- reCAPTCHA Checkbox
- Number Input
- Phone Input with Country Code

### Button Labels and Actions

- `E-TICKET APPLICATION` (Navigates to application form)
- `CONSULT E-TICKET` (Navigates to ticket lookup)
- `Viajero Digital` (External link)
- `Solicitar` (Submits initial application request)
- `SALIR` (Exits the form)
- `PASO ANTERIOR` (Navigates to the previous form step)
- `SIGUIENTE` (Navigates to the next form step)
- `Descargar PDF` (Downloads the E-Ticket as a PDF)
- `Enviar por correo electrónico` (Sends the E-Ticket via email)
- `Modificar` (Allows editing of the submitted form)

### Validation Messages

*[To be documented based on visual analysis]*
