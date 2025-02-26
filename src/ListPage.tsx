import React from 'react';
import ListItem from './ListItem.tsx';

// 定义数据模型的类型
interface DataItem {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    url: string;
}

const data: DataItem[] = [
    {
        id: 1,
        title: '中国历代军事陈列',
        description: '“中国历代军事陈列”位于展览大楼一层东侧3个展厅，展示面积3152平方米，展出照片图表470余张、文物1300余件、艺术品60余件、图表制字130余幅，主要展示先秦至民国成立中华民族数千年军事文明，以历代战争和军队...',
        imageUrl: 'http://www.jb.mil.cn/zlcl/jbcl/jscl/images/P020170712398735096129.jpg',
        url: 'http://3d.jb.mil.cn/lidai/index.html#' // 第三方网页 URL
    },
    {
        id: 1,
        title: '党领导的革命战争陈列',
        description: '中国共产党领导的革命战争陈列”，主要展示1921年至1949年，党领导新民主主义革命的辉煌历程和取得的伟大成就。展示内容以中国共产党领导的革命战争史为主线，重点是人民军队战史、军史，突出军事特色，处理好...',
        imageUrl: 'http://www.jb.mil.cn/zlcl/jbcl/jmzzcl/images/P020170707463886229079.jpg',
        url: 'http://3d.jb.mil.cn/gming/index.html' // 第三方网页 URL
    },
    {
        id: 1,
        title: '军事科技陈列',
        description: '“军事科技陈列”分别位于负一层、一层和二层的6个展厅内，展示面积7500平方米，设置陆军重武器装备技术、陆军轻武器装备技术、海军武器装备技术、空军武器装备技术、导弹武器装备技术、核武器与核技术和平利用展...',
        imageUrl: 'http://www.jb.mil.cn/zlcl/jbcl/jskjcl/images/P020170712373637744106.jpg',
        url: 'http://3d.jb.mil.cn/keji/daod/index.html' // 第三方网页 URL
    },
    {
        id: 1,
        title: '兵器陈列',
        description: '“兵器陈列”分三个展区，负一层中央大厅陈列坦克装甲车辆、各型火炮、U2飞机残骸、红旗2号导弹，一层中央大厅陈列飞机、导弹和舰艇，二层东、西、南3个回廊陈列手枪、步枪、冲锋枪、机枪、弹药、刀具等。',
        imageUrl: 'http://www.jb.mil.cn/zlcl/jbcl/bqcl/images/P020170712372640472802.jpg',
        url: 'http://3d.jb.mil.cn/bqcl/plane/index.html#' // 第三方网页 URL
    },
];

const ListPage: React.FC = () => {
    return (
        <div>
            {data.map(item => (
                <ListItem key={item.id} {...item} />
            ))}
        </div>
    );
}

export default ListPage;
