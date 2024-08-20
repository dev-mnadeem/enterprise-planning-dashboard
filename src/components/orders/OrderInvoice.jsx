import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';

Font.register({
  family: 'Poppins',
  fontWeight: 900,
  src: 'https://fonts.gstatic.com/s/poppins/v1/TDTjCH39JjVycIF24TlO-Q.ttf',
});

const styles = StyleSheet.create({
  page: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  customerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 20,
  },
  section: {
    marginBottom: 10,
  },
  sectionHeader: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 14,
    fontWeight: 'heavy',
    marginTop: 10,
    marginBottom: 5,
  },
  text: {
    fontSize: 10,
  },
  line: {
    marginVertical: 10,
    height: 1,
    backgroundColor: '#000',
  },
  logo: {
    width: 150,
    height: 40,
  },
  boldText: {
    fontFamily: 'Courier-Bold',
    fontWeight: 900,
    fontSize: 12,
  },
  rightAlign: {
    textAlign: 'right',
  },
  table: {
    display: 'table',
    width: 'auto',
    margin: '10px 0',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    padding: 5,
  },
  tableCell: {
    fontSize: 10,
  },
  totalAmount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'red',
    textAlign: 'right',
  },
  footer: {
    marginTop: 20,
    fontSize: 8,
    textAlign: 'center',
  },
  table: {
    display: 'table',
    width: 'auto',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '25%',
    borderStyle: 'solid',
    borderColor: '#000',
    borderBottomWidth: 1,
    textAlign: 'left',
    padding: 5,
    fontSize: 10,
    fontWeight: 900,
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderColor: '#000',
    borderBottomWidth: 1,
    padding: 5,
    fontSize: 10,
  },
  barcode: {
    width: '100%',
    height: 50,
  },
});

const ShipmentReceipt = ({ order, barcodeImageUrl }) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.header}>
        <Image style={styles.logo} src="/assets/adinkra-logo.png" />
        <View>
          <Image src={barcodeImageUrl} style={styles.barcode} />
          <Text style={styles.text}>Tracking #{order?.order_number}</Text>
        </View>
      </View>

      <View style={styles.line} />

      <View style={styles.customerInfo}>
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Shipment From</Text>
          <Text style={styles.text}>{order?.sender_name || ''}</Text>
          <Text style={styles.text}>{order?.sender_email || ''}</Text>
          <Text style={styles.text}>{order?.sender_phone || ''}</Text>
          <Text style={styles.text}>{'\n'}</Text>
          <Text
            style={styles.text}
          >{`${order?.sender_city?.name}, ${order?.sender_city?.state?.name}`}</Text>
          <Text style={styles.text}>{`${order?.sender_city?.state?.country?.name}`}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Shipment To</Text>
          <Text style={styles.text}>{order?.receiver_name || ''}</Text>
          <Text style={styles.text}>{order?.receiver_email || ''}</Text>
          <Text style={styles.text}>{order?.receiver_phone || ''}</Text>
          <Text style={styles.text}>{'\n'}</Text>
          <Text style={styles.text}>{order?.receiver_address || ''}</Text>
          <Text
            style={styles.text}
          >{`${order?.receiver_city?.name}, ${order?.receiver_city?.state?.name}`}</Text>
          <Text style={styles.text}>{`${order?.receiver_city?.state?.country?.name}`}</Text>
        </View>
      </View>

      <Text style={styles.text}>{'\n\n'}</Text>

      <View>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableColHeader, , { width: '10%' }]}>#</Text>
            <Text style={styles.tableColHeader}>Name</Text>
            <Text style={styles.tableColHeader}>DESCRIPTION</Text>
            <Text style={[styles.tableColHeader, { textAlign: 'center' }]}>WEIGHT</Text>
            <Text style={[styles.tableColHeader, { textAlign: 'center' }]}>QTY</Text>
          </View>

          {order?.order_items?.map((item, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={[styles.tableCol, { width: '10%' }]}>{index + 1}</Text>
              <Text style={styles.tableCol}>{item.name || 'N/A'}</Text>
              <Text style={styles.tableCol}>{item.description || 'N/A'}</Text>
              <Text style={[styles.tableCol, { textAlign: 'center' }]}>{item.weight}</Text>
              <Text style={[styles.tableCol, { textAlign: 'center' }]}>{item.quantity}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Package Details</Text>
        <Text style={styles.text}>Packaging: {`${order?.package?.name}`}</Text>
        <Text style={styles.text}>
          Dimensional: [{order?.package?.width} x {order?.package?.height} x {order?.package?.depth}
          ] inch
        </Text>
        <Text style={styles.text}>Number of Pieces: {order?.total_quantity || 'N/A'}</Text>
        <Text style={styles.text}>
          Total Weight: {order?.total_weight || ''} {order?.weight_type || ''}
        </Text>
        <Text style={styles.text}>Insured Amount: N/A</Text>
        <Text style={styles.text}>Terms of Trade: DDP</Text>
        <Text style={styles.text}>
          Shipping Date: {`${new Date(order?.shipping_date || new Date()).toLocaleString()}`}
        </Text>
        <Text style={styles.text}>
          Collection Time: {`${new Date(order?.collection_time || new Date()).toLocaleString()}`}
        </Text>
      </View>

      <View style={styles.line} />

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Billing Information</Text>
        <Text style={styles.text}>Payment Type: {order?.payment_type || 'N/A'}</Text>
        <Text style={styles.text}>Status: {order?.payment_status || 'N/A'}</Text>
        <Text style={styles.text}>Shipment Charges: {order?.sub_total || '0'}</Text>
        <Text style={styles.text}>Service Charges: {order?.service_charges || '0'}</Text>
        <Text style={styles.text}>Other Taxes: {order?.other_taxes || '0'}</Text>
        <Text style={styles.text}>VAT: {order?.vat || '0'}</Text>
        <Text style={styles.text}>Discount: {`$${order?.discount}` || 'N/A'}</Text>
        <Text style={styles.text}>
          Paid on: {`${new Date(order?.payment_date || new Date()).toLocaleString()}` || 'N/A'}
        </Text>
        <Text style={styles.text}>{'\n'}</Text>
        <Text style={styles.text}>
          Total Amount: <Text style={styles.boldText}>{`$${order?.total_amount}` || 'N/A'}</Text>
        </Text>
      </View>

      <Text style={styles.footer}>
        {new Date().getFullYear()} © Adinkra Cargo - All rights reserved
      </Text>
    </Page>
  </Document>
);

export default ShipmentReceipt;
