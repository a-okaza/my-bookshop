module.exports = (srv) => {

     const {Books} = cds.entities('my.bookshop')

      srv.before ('CREATE', 'Orders', async (req) => {
          // リクエストデータから order　の情報を取得

          const order = req.data
          if (!order.amount || order.amount <= 0) return req.error(400, 'Order at least 1 book 在庫がないよ')
      
          // 現在の在庫を取得
          let {stock} = await SELECT .one .from(Books)
                                          .columns(b => { b.stock})
                                          .where ({ID: order.book_ID})

          //在庫がない時は処理終了
          if (stock < order.amount) return req.error(409, 'Sold out , sorry " 在庫ないよ！')

          //在庫を更新
          let affectedRows = await UPDATE (Books)
                                  .set ({stock: stock - order.amount})
                                  .where ({ID: order.book_ID})

          if (affectedRows === 0) req.error(409, 'Sold out , sorry " 売り切れ！')
      })
    
     srv.after('READ' , 'Books' , each => {
         if (each.stock > 111) each.title += ' --11%discount! 沢山あるから値引き！'
     })

}